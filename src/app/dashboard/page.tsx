'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useProgress } from '@/hooks/useProgress'
import { useUser } from '@/hooks/useUser'

type NavItem = {
  label: string
  href: string
  active?: boolean
  badge?: string
}

type NavSection = {
  section: string
  items: NavItem[]
}

const NAV_ITEMS: NavSection[] = [
  {
    section: 'Utama', items: [
      { label: 'Dashboard', href: '/dashboard', active: true },
      { label: 'Progress Saya', href: '/progress' },
      { label: 'Riwayat Bacaan', href: '/riwayat' },
    ]
  },
  {
    section: 'Tilawah', items: [
      { label: 'Catat Bacaan', href: '/catat', badge: 'Baru' },
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

const STREAK_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const RAMADAN_END = new Date('2025-03-29')
const sisaHari = Math.max(0, Math.ceil((RAMADAN_END.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

export default function DashboardPage() {
  const router = useRouter()
  const { profile } = useUser()
  const { progress, streak, loading, saveProgress, completedJuz, todayPages, totalJuzDone } = useProgress()

  const [selectedJuz, setSelectedJuz] = useState('1')
  const [pages, setPages] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  async function handleSaveProgress() {
    if (!pages) return
    setSaving(true)
    setSaveMsg('')
    const { error } = await saveProgress(Number(selectedJuz), Number(pages), date)
    if (error) {
      setSaveMsg('Gagal menyimpan, coba lagi.')
    } else {
      setSaveMsg('Progress tersimpan!')
      setPages('')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const statsData = [
    { label: 'Juz Selesai', value: String(totalJuzDone), unit: '/ 30', sub: `${Math.round((totalJuzDone / 30) * 100)}% menuju khatam`, accent: '#c9a84c' },
    { label: 'Streak Hari Ini', value: String(streak?.current_streak ?? 0), unit: 'hari', sub: `Terbaik: ${streak?.longest_streak ?? 0} hari`, accent: '#2dd4bf' },
    { label: 'Halaman Hari Ini', value: String(todayPages), unit: 'hal', sub: 'Target: 20 halaman', accent: '#a78bfa' },
    { label: 'Sisa Hari', value: String(sisaHari), unit: 'hari', sub: 'Ramadan berakhir 29 Mar', accent: '#fb7185' },
  ]

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
        .stat-card { background:#141828;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px;position:relative;overflow:hidden;transition:border-color 0.2s; }
        .stat-card:hover { border-color:rgba(201,168,76,0.2); }
        .juz-item { aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:600;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);color:#6b7080;cursor:pointer;transition:all 0.15s; }
        .juz-item:hover { border-color:rgba(201,168,76,0.2);color:#c9a84c; }
        .juz-item.done { background:rgba(201,168,76,0.12);border-color:rgba(201,168,76,0.2);color:#c9a84c; }
        .juz-item.active { background:rgba(201,168,76,0.25);border-color:#c9a84c;color:#e8c97a;box-shadow:0 0 8px rgba(201,168,76,0.3); }
        select, input[type="number"], input[type="date"] { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 10px;font-size:0.82rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        select:focus, input[type="number"]:focus, input[type="date"]:focus { border-color:#c9a84c; }
        select option { background:#11152a; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        .btn-save { width:100%;padding:10px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:8px;font-family:inherit;font-size:0.85rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s; }
        .btn-save:hover { opacity:0.9;transform:translateY(-1px); }
        .btn-save:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
        .streak-dot { width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:#6b7080; }
        .streak-dot.done { background:rgba(201,168,76,0.12);border-color:#c9a84c;color:#c9a84c; }
        .streak-dot.today { background:rgba(201,168,76,0.3);border-color:#c9a84c;color:#e8c97a;box-shadow:0 0 8px rgba(201,168,76,0.3); }
        @media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(2,1fr) !important; } .main-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .sidebar { transform:translateX(-100%); } .main-content { margin-left:0 !important; } }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar" style={{ width: 260, flexShrink: 0, background: '#0e1225', borderRight: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>

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
              {items.map(({ label, href, active, badge }) => (
                <a key={label} href={href} className={`nav-item${active ? ' active' : ''}`}>
                  {label}
                  {badge && (
                    <span style={{ marginLeft: 'auto', background: '#c9a84c', color: '#0c0f1a', fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{badge}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="#" className="nav-item" style={{ color: '#f87171' }} onClick={e => { e.preventDefault(); handleLogout() }}>
            Keluar
          </a>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content" style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <div style={{ height: 60, background: '#0e1225', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Dashboard</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>
            ١٢ رمضان ١٤٤٦
          </span>
        </div>

        <div style={{ padding: 32, flex: 1 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>
              Assalamu&apos;alaikum, <span style={{ color: '#c9a84c' }}>{profile?.full_name?.split(' ')[0] ?? 'Sahabat'}</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#9095a8' }}>
              {loading ? 'Memuat data...' : `Kamu sudah membaca ${totalJuzDone} dari 30 juz. Semangat terus!`}
            </p>
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
            {statsData.map(({ label, value, unit, sub, accent }) => (
              <div key={label} className="stat-card">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
                <div style={{ fontSize: '0.72rem', color: '#6b7080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>
                  {loading ? '—' : value}{' '}
                  <span style={{ fontSize: '0.88rem', color: '#9095a8', fontWeight: 400 }}>{unit}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9095a8' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Progress Khatam */}
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Progress Khatam</span>
                  <a href="/progress" style={{ fontSize: '0.78rem', color: '#c9a84c', textDecoration: 'none' }}>Lihat Detail</a>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: '#9095a8' }}>Progress keseluruhan</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c9a84c' }}>{totalJuzDone} / 30 Juz</span>
                  </div>
                  <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ height: '100%', width: `${(totalJuzDone / 30) * 100}%`, borderRadius: 99, background: 'linear-gradient(90deg,#c9a84c,#e8c97a)', boxShadow: '0 0 10px rgba(201,168,76,0.4)', transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 5 }}>
                    {Array.from({ length: 30 }, (_, i) => {
                      const juzNum = i + 1
                      const isDone = completedJuz.includes(juzNum)
                      const isActive = !isDone && progress.some(p => p.juz_number === juzNum)
                      return (
                        <div key={i} className={`juz-item${isDone ? ' done' : isActive ? ' active' : ''}`}>{juzNum}</div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
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

              {/* Catat Bacaan */}
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Catat Bacaan Hari Ini</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ background: '#11152a', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7080', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Juz</label>
                        <select value={selectedJuz} onChange={e => setSelectedJuz(e.target.value)}>
                          {Array.from({ length: 30 }, (_, i) => (
                            <option key={i} value={String(i + 1)}>Juz {i + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7080', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Halaman</label>
                        <input type="number" placeholder="cth: 8" min={1} max={20} value={pages} onChange={e => setPages(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#6b7080', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tanggal</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                      </div>
                    </div>
                    <button className="btn-save" onClick={handleSaveProgress} disabled={saving || !pages}>
                      {saving ? 'Menyimpan...' : 'Simpan Progress'}
                    </button>
                    {saveMsg && (
                      <p style={{ fontSize: '0.8rem', marginTop: 10, textAlign: 'center', color: saveMsg.includes('tersimpan') ? '#2dd4bf' : '#f87171' }}>{saveMsg}</p>
                    )}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#6b7080', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Riwayat Terakhir</div>

                  {loading ? (
                    <p style={{ fontSize: '0.85rem', color: '#6b7080', padding: '12px 0' }}>Memuat...</p>
                  ) : progress.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#6b7080', padding: '12px 0' }}>Belum ada catatan. Yuk mulai catat bacaanmu!</p>
                  ) : (
                    progress.slice(0, 3).map(({ id, juz_number, read_at, pages_read }) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#c9a84c', flexShrink: 0 }}>J{juz_number}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 2 }}>
                            Juz {juz_number} {pages_read >= 20 ? '— Selesai' : `— ${pages_read} hal`}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#9095a8' }}>
                            {new Date(read_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ display: 'block', fontSize: '0.88rem', color: '#e8e4d9' }}>{pages_read} hal</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Streak */}
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Streak Harian</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ textAlign: 'center', paddingBottom: 20 }}>
                    <div style={{ fontSize: '4rem', fontWeight: 700, color: '#c9a84c', lineHeight: 1, textShadow: '0 0 30px rgba(201,168,76,0.35)' }}>
                      {loading ? '—' : streak?.current_streak ?? 0}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9095a8', marginTop: 6 }}>hari berturut-turut</div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7080', marginTop: 2 }}>Terbaik: {streak?.longest_streak ?? 0} hari</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    {STREAK_DAYS.map((day, i) => (
                      <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <div className={`streak-dot${i < 6 ? ' done' : ' today'}`}>{i < 6 ? '✓' : '·'}</div>
                        <div style={{ fontSize: '0.58rem', color: '#6b7080' }}>{day}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target */}
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Target Ramadan</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  {[
                    { name: "Khatam Al-Qur'an", pct: Math.round((totalJuzDone / 30) * 100), color: '#c9a84c' },
                    { name: '20 halaman / hari', pct: Math.min(100, Math.round((todayPages / 20) * 100)), color: '#2dd4bf' },
                    { name: 'Streak 30 hari', pct: Math.min(100, Math.round(((streak?.current_streak ?? 0) / 30) * 100)), color: '#a78bfa' },
                  ].map(({ name, pct, color }) => (
                    <div key={name} style={{ marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <span style={{ fontSize: '0.82rem', color: '#9095a8' }}>{name}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color }}>{pct}%</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: color, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ayat */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '20px 22px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.35rem', color: '#c9a84c', lineHeight: 1.7, marginBottom: 10 }}>
                  وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9095a8', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &quot;Dan bacalah Al-Qur&apos;an dengan tartil&quot;
                </div>
                <div style={{ fontSize: '0.7rem', color: '#c9a84c', marginTop: 8, opacity: 0.7 }}>QS. Al-Muzzammil: 4</div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}