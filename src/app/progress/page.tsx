'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useUser } from '@/hooks/useUser'
import { useProgress } from '@/hooks/useProgress'

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
      { label: 'Progress Saya', href: '/progress', active: true },
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
      { label: 'Profil Saya', href: '/profil' },
      { label: 'Pengaturan', href: '/settings' },
    ]
  },
]

export default function ProgressPage() {
  const router = useRouter()
  const { profile } = useUser()
  const { progress, streak, loading, completedJuz, totalJuzDone } = useProgress()

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  const pctKhatam = Math.round((totalJuzDone / 30) * 100)

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
        .juz-item { aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);color:#6b7080;cursor:default;transition:all 0.15s;padding:8px; }
        .juz-item.done { background:rgba(201,168,76,0.12);border-color:rgba(201,168,76,0.2);color:#c9a84c; }
        .juz-item.active { background:rgba(201,168,76,0.2);border-color:#c9a84c;color:#e8c97a;box-shadow:0 0 10px rgba(201,168,76,0.25); }
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
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Progress Saya</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>١٢ رمضان ١٤٤٦</span>
        </div>

        <div style={{ padding: 32, flex: 1 }}>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Juz Selesai', value: `${totalJuzDone}`, unit: '/ 30', accent: '#c9a84c' },
              { label: 'Progress', value: `${pctKhatam}%`, unit: 'khatam', accent: '#2dd4bf' },
              { label: 'Streak', value: `${streak?.current_streak ?? 0}`, unit: 'hari', accent: '#a78bfa' },
              { label: 'Terbaik', value: `${streak?.longest_streak ?? 0}`, unit: 'hari', accent: '#fb7185' },
            ].map(({ label, value, unit, accent }) => (
              <div key={label} style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
                <div style={{ fontSize: '0.7rem', color: '#6b7080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1, color: accent }}>
                  {loading ? '—' : value} <span style={{ fontSize: '0.85rem', color: '#9095a8', fontWeight: 400 }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar khatam */}
          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Progress Khatam Al-Qur&apos;an</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c9a84c' }}>{totalJuzDone} / 30 Juz</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${pctKhatam}%`, borderRadius: 99, background: 'linear-gradient(90deg,#c9a84c,#e8c97a)', boxShadow: '0 0 12px rgba(201,168,76,0.4)', transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b7080' }}>{pctKhatam}% selesai — {30 - totalJuzDone} juz lagi menuju khatam</div>
          </div>

          {/* Grid 30 Juz detail */}
          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 28px' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>Detail Per Juz</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7080', marginBottom: 20 }}>Klik juz untuk melihat detail bacaan</div>

            {loading ? (
              <p style={{ color: '#6b7080', fontSize: '0.85rem' }}>Memuat...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
                {Array.from({ length: 30 }, (_, i) => {
                  const juzNum = i + 1
                  const isDone = completedJuz.includes(juzNum)
                  const juzLogs = progress.filter(p => p.juz_number === juzNum)
                  const isActive = !isDone && juzLogs.length > 0
                  const totalPages = juzLogs.reduce((sum, p) => sum + p.pages_read, 0)

                  return (
                    <div key={i} className={`juz-item${isDone ? ' done' : isActive ? ' active' : ''}`}>
                      <div style={{ fontSize: '0.7rem', color: 'inherit', fontWeight: 700 }}>Juz {juzNum}</div>
                      <div style={{ fontSize: '0.65rem', color: isDone ? '#c9a84c' : '#6b7080' }}>
                        {isDone ? 'Selesai' : isActive ? `${totalPages} hal` : 'Belum'}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
              {[
                { color: '#c9a84c', label: 'Selesai' },
                { color: 'rgba(201,168,76,0.4)', label: 'Sedang' },
                { color: 'rgba(255,255,255,0.06)', label: 'Belum' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#9095a8' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />{label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}