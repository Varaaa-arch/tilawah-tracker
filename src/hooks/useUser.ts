'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  username: string
  full_name: string
}

export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  return { profile, loading }
}