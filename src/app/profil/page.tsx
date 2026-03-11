'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useUser } from '@/hooks/useUser'
import { useProgress } from '@/hooks/useProgress'
import { supabase } from '@/lib/supabase'

type NavItem = {
  label: string
  href: string
  active?: boolean
}

type NavSection = {
  section: string
  items: NavItem[]
}

const NAV_ITEMS: NavSection[] = [
  {
    section: 'Utama', items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Progress Saya', href: '/progress' },
      { label: 'Riwayat Bacaan', href: '/riwayat' },
    ]
  },
  {
    section: 'Tilawah', items: [
      { label: 'Catat Bacaan', href: '/catat' },
      { label: 'Streak Saya', href: '/streak' },
      { label: 'Target Khatam', href: '/target' },
    ]
  },
  {
    section: 'Akun', items: [
      { label: 'Profil Saya', href: '/profil', active: true },
      { label: 'Pengaturan', href: '/settings' },
    ]
  },
]

export default function ProfilPage() {
  const router = useRouter()
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

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '??'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0c0f1a', color: '#e8e4d9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 99px; }
        .nav-item { display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;font-size:0.85rem;color:#9095a8;cursor:pointer;transition:all 0.18s;text-decoration:none;margin-bottom:2px;border:1px solid transparent; }
        .nav-item:hover { background:rgba(255,255,255,0.04);color:#e8e4d9; }
        .nav-item.active { background:rgba(201,168,76,0.12);color:#c9a84c;border-color:rgba(201,168,76,0.2); }
        input[type="text"] { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 14px;font-size:0.9rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        input[type="text"]:focus { border-color:#c9a84c; }
        input[type="text"]:disabled { opacity:0.5;cursor:not-allowed; }
        .btn-primary { padding:10px 20px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:8px;font-family:inherit;font-size:0.85rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s; }
        .btn-primary:hover { opacity:0.9;transform:translateY(-1px); }
        .btn-primary:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
        .btn-secondary { padding:10px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:inherit;font-size:0.85rem;color:#9095a8;cursor:pointer;transition:all 0.2s; }
        .btn-secondary:hover { background:rgba(255,255,255,0.07);color:#e8e4d9; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 260, flexShrink: 0, background: '#0e1225', borderRight: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
            Tilawah<span style={{ color: '#c9a84c' }}>Tracker</span>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{profile?.full_name ?? '...'}</div>
            <div style={{ fontSize: '0.75rem', color: '#c9a84c' }}>@{profile?.username ?? '...'}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ section, items }) => (
            <div key={section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7080', padding: '0 8px', marginBottom: 6 }}>{section}</div>
              {items.map(({ label, href, active }) => (
                <a key={label} href={href} className={`nav-item${active ? ' active' : ''}`}>{label}</a>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="#" className="nav-item" style={{ color: '#f87171' }} onClick={e => { e.preventDefault(); handleLogout() }}>Keluar</a>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <div style={{ height: 60, background: '#0e1225', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Profil Saya</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>١٢ رمضان ١٤٤٦</span>
        </div>

        <div style={{ padding: 32, flex: 1, maxWidth: 720 }}>

          {/* Avatar + nama */}
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

          {/* Statistik */}
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

          {/* Edit Profil */}
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
                  <input
                    type="text"
                    value={editing ? fullName : (profile?.full_name ?? '')}
                    onChange={e => setFullName(e.target.value)}
                    disabled={!editing}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Username</label>
                  <input
                    type="text"
                    value={editing ? username : (profile?.username ?? '')}
                    onChange={e => setUsername(e.target.value)}
                    disabled={!editing}
                    placeholder="username"
                  />
                </div>
              </div>

              {saveMsg && (
                <p style={{ fontSize: '0.82rem', marginBottom: 16, color: saveMsg.includes('berhasil') ? '#2dd4bf' : '#f87171' }}>{saveMsg}</p>
              )}

              {editing && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button className="btn-secondary" onClick={cancelEdit}>Batal</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
