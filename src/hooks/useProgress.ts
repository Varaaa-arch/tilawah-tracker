'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProgressLog {
  id: string
  juz_number: number
  pages_read: number
  read_at: string
}

export interface StreakData {
  current_streak: number
  longest_streak: number
  last_read_at: string | null
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressLog[]>([])
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const [{ data: logs }, { data: streakData }] = await Promise.all([
      supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .order('read_at', { ascending: false }),
      supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ])

    setProgress(logs ?? [])
    setStreak(streakData ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled || !user) {
        setLoading(false)
        return
      }

      const [{ data: logs }, { data: streakData }] = await Promise.all([
        supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .order('read_at', { ascending: false }),
        supabase
          .from('streaks')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ])

      if (!cancelled) {
        setProgress(logs ?? [])
        setStreak(streakData ?? null)
        setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  async function updateStreak(userId: string, readAt: string) {
    const { data: currentStreak } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!currentStreak) return

    const today = new Date(readAt)
    const lastRead = currentStreak.last_read_at ? new Date(currentStreak.last_read_at) : null
    const diffDays = lastRead
      ? Math.floor((today.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24))
      : null

    let newStreak = currentStreak.current_streak

    if (diffDays === null || diffDays >= 2) {
      newStreak = 1
    } else if (diffDays === 1) {
      newStreak += 1
    }

    await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, currentStreak.longest_streak),
        last_read_at: readAt
      })
      .eq('user_id', userId)
  }

  async function saveProgress(juzNumber: number, pagesRead: number, readAt: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not logged in' }

    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('juz_number', juzNumber)
      .eq('read_at', readAt)
      .single()

    let error = null

    if (existing) {
      const { error: updateError } = await supabase
        .from('progress')
        .update({ pages_read: pagesRead })
        .eq('id', existing.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('progress')
        .insert({ user_id: user.id, juz_number: juzNumber, pages_read: pagesRead, read_at: readAt })
      error = insertError
    }

    if (!error) {
      await updateStreak(user.id, readAt)
      await fetchAll()
    }

    return { error }
  }

  const completedJuz = [...new Set(
    progress.filter(p => p.pages_read >= 20).map(p => p.juz_number)
  )]

  const todayPages = progress
    .filter(p => p.read_at === new Date().toISOString().split('T')[0])
    .reduce((sum, p) => sum + p.pages_read, 0)

  return {
    progress,
    streak,
    loading,
    saveProgress,
    completedJuz,
    todayPages,
    totalJuzDone: completedJuz.length,
  }
}