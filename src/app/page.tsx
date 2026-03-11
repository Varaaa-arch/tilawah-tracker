import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { error } = await supabase.from('profiles').select('*')
  
  return (
    <main>
      <p>{error ? 'Gagal konek' : 'Supabase connected!'}</p>
    </main>
  )
}