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
      { label: 'Riwayat Bacaan', href: '/riwayat', active: true },
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
      { label: 'Profil Saya', href: '/profil' },
      { label: 'Pengaturan', href: '/settings' },
    ]
  },
]

export default function RiwayatPage() {
  const router = useRouter()
  const { profile } = useUser()
  const { progress, loading } = useProgress()

  const [filterJuz, setFilterJuz] = useState('semua')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await supabase.from('progress').delete().eq('id', id)
    window.location.reload()
  }

  const filtered = filterJuz === 'semua'
    ? progress
    : progress.filter(p => p.juz_number === Number(filterJuz))

  const grouped = filtered.reduce<Record<string, typeof progress>>((acc, log) => {
    const key = log.read_at
    if (!acc[key]) acc[key] = []
    acc[key].push(log)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

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
        select { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 12px;font-size:0.82rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        select:focus { border-color:#c9a84c; }
        select option { background:#11152a; }
        .log-row { display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04); }
        .log-row:last-child { border-bottom:none; }
        .delete-btn { background:none;border:1px solid rgba(248,113,113,0.2);border-radius:6px;color:#f87171;font-size:0.75rem;padding:5px 10px;cursor:pointer;font-family:inherit;transition:all 0.2s;opacity:0; }
        .log-row:hover .delete-btn { opacity:1; }
        .delete-btn:hover { background:rgba(248,113,113,0.1); }
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
        <div style={{ height: 60, background: '#0e1225', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Riwayat Bacaan</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>١٢ رمضان ١٤٤٦</span>
        </div>

        <div style={{ padding: 32, flex: 1 }}>

          {/* Header + filter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Riwayat Bacaan</h1>
              <p style={{ fontSize: '0.82rem', color: '#9095a8' }}>Total {progress.length} catatan bacaan tersimpan</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7080' }}>Filter Juz:</span>
              <select value={filterJuz} onChange={e => setFilterJuz(e.target.value)}>
                <option value="semua">Semua Juz</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i} value={String(i + 1)}>Juz {i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Log list */}
          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#6b7080', fontSize: '0.85rem' }}>Memuat riwayat...</div>
            ) : sortedDates.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', color: '#6b7080', marginBottom: 6 }}>Belum ada riwayat bacaan</div>
                <div style={{ fontSize: '0.82rem', color: '#4a4e5e' }}>Mulai catat bacaan dari halaman Dashboard</div>
              </div>
            ) : (
              sortedDates.map((date, di) => (
                <div key={date}>
                  {/* Date header */}
                  <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)', borderTop: di !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e8e4d9' }}>
                        {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#6b7080', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 20 }}>
                        {grouped[date].length} catatan
                      </span>
                    </div>
                  </div>

                  {/* Logs for this date */}
                  <div style={{ padding: '0 24px' }}>
                    {grouped[date].map(({ id, juz_number, pages_read }) => (
                      <div key={id} className="log-row">
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: pages_read >= 20 ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${pages_read >= 20 ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: pages_read >= 20 ? '#c9a84c' : '#6b7080', flexShrink: 0 }}>
                          J{juz_number}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: 2 }}>Juz {juz_number}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7080' }}>
                            {pages_read >= 20 ? 'Selesai — 20 halaman' : `${pages_read} halaman dibaca`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: pages_read >= 20 ? '#c9a84c' : '#e8e4d9' }}>{pages_read} hal</div>
                            <div style={{ fontSize: '0.7rem', color: pages_read >= 20 ? '#c9a84c' : '#6b7080' }}>{pages_read >= 20 ? 'Selesai' : 'Sebagian'}</div>
                          </div>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(id)}
                            disabled={deleting === id}
                          >
                            {deleting === id ? '...' : 'Hapus'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
