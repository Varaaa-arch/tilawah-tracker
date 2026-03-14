import { supabase } from './supabase'

export async function register(
  email: string,
  password: string,
  username: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName }
    }
  })
  return { data, error }
}

export async function login(username: string, password: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    return { data: null, error: { message: 'Username tidak ditemukan' } }
  }

  const { data: userData, error: userError } = await supabase
    .rpc('get_email_by_id', { user_id: profile.id })

  if (userError || !userData) {
    return { data: null, error: { message: 'Gagal mengambil data user' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData,
    password,
  })

  return { data, error }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}