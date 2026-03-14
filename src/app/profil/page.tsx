'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useProgress } from '@/hooks/useProgress'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProfilPage() {
  const { profile, loading: profileLoading } = useUser()
  const { totalJuzDone, streak } = useProgress()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  function startEdit() {
    setFullName(profile?.full_name ?? '')
    setUsername(profile?.username ?? '')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveMsg('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username })
      .eq('id', user.id)
    if (error) {
      setSaveMsg('Gagal menyimpan, coba lagi.')
    } else {
      setSaveMsg('Profil berhasil diperbarui!')
      setEditing(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
    setSaving(false)
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '??'

  return (
    <DashboardLayout title="Profil Saya">
      <div style={{ maxWidth: 720 }}>

        <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#8b6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#0c0f1a', flexShrink: 0, boxShadow: '0 0 24px rgba(201,168,76,0.3)' }}>
            {profileLoading ? '?' : initials}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>{profile?.full_name ?? '...'}</div>
            <div style={{ fontSize: '0.85rem', color: '#c9a84c', marginBottom: 8 }}>@{profile?.username ?? '...'}</div>
            <div style={{ fontSize: '0.78rem', color: '#6b7080' }}>Member Tilawah Tracker</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Juz Selesai', value: `${totalJuzDone} / 30` },
            { label: 'Streak Sekarang', value: `${streak?.current_streak ?? 0} hari` },
            { label: 'Streak Terbaik', value: `${streak?.longest_streak ?? 0} hari` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#c9a84c', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7080', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Informasi Akun</span>
            {!editing && (
              <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={startEdit}>Edit</button>
            )}
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nama Lengkap</label>
                <input type="text" value={editing ? fullName : (profile?.full_name ?? '')} onChange={e => setFullName(e.target.value)} disabled={!editing} placeholder="Nama lengkap" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
                <input type="text" value={editing ? username : (profile?.username ?? '')} onChange={e => setUsername(e.target.value)} disabled={!editing} placeholder="username" />
              </div>
            </div>
            {saveMsg && (
              <p style={{ fontSize: '0.82rem', marginBottom: 16, color: saveMsg.includes('berhasil') ? '#2dd4bf' : '#f87171' }}>{saveMsg}</p>
            )}
            {editing && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                <button className="btn-secondary" onClick={cancelEdit}>Batal</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}