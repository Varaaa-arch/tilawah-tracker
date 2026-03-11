'use server'

import { createSupabaseServer } from './supabase-server'

export async function register(
  email: string,
  password: string,
  username: string,
  fullName: string
) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName }
    }
  })
  return { data, error }
}

export async function login(email: string, password: string) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function logout() {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.signOut()
  return { error }
}