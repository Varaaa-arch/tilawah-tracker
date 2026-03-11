'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useUser } from '@/hooks/useUser'
import { useProgress } from '@/hooks/useProgress'

type NavItem = { label: string; href: string; active?: boolean }
type NavSection = { section: string; items: NavItem[] }

const NAV_ITEMS: NavSection[] = [
  { section: 'Utama', items: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Progress Saya', href: '/progress' },
    { label: 'Riwayat Bacaan', href: '/riwayat' },
  ]},
  { section: 'Tilawah', items: [
    { label: 'Catat Bacaan', href: '/catat' },
    { label: 'Streak Saya', href: '/streak' },
    { label: 'Target Khatam', href: '/target', active: true },
  ]},
  { section: 'Akun', items: [
    { label: 'Profil Saya', href: '/profil' },
    { label: 'Pengaturan', href: '/settings' },
  ]},
]

const RAMADAN_END = new Date('2025-03-29')

export default function TargetPage() {
  const router = useRouter()
  const { profile } = useUser()
  const { streak, loading, totalJuzDone, todayPages } = useProgress()

  const [targetHalaman, setTargetHalaman] = useState('20')
  const [targetStreak, setTargetStreak] = useState('30')
  const [saved, setSaved] = useState(false)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  function handleSaveTarget() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sisaHari = Math.max(0, Math.ceil((RAMADAN_END.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  const sisaJuz = Math.max(0, 30 - totalJuzDone)
  const juzPerHari = sisaHari > 0 ? (sisaJuz / sisaHari).toFixed(1) : '0'

  const targets = [
    {
      label: 'Khatam Al-Qur\'an',
      desc: '30 juz selesai sebelum akhir Ramadan',
      current: totalJuzDone,
      total: 30,
      unit: 'juz',
      color: '#c9a84c',
      pct: Math.round((totalJuzDone / 30) * 100),
    },
    {
      label: 'Target Halaman Harian',
      desc: `${targetHalaman} halaman per hari`,
      current: todayPages,
      total: Number(targetHalaman),
      unit: 'hal hari ini',
      color: '#2dd4bf',
      pct: Math.min(100, Math.round((todayPages / Number(targetHalaman)) * 100)),
    },
    {
      label: 'Target Streak',
      desc: `${targetStreak} hari berturut-turut`,
      current: streak?.current_streak ?? 0,
      total: Number(targetStreak),
      unit: 'hari',
      color: '#a78bfa',
      pct: Math.min(100, Math.round(((streak?.current_streak ?? 0) / Number(targetStreak)) * 100)),
    },
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
        input[type="number"] { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;font-size:0.88rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        input[type="number"]:focus { border-color:#c9a84c; }
        .btn-save { padding:10px 24px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:8px;font-family:inherit;font-size:0.85rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s; }
        .btn-save:hover { opacity:0.9;transform:translateY(-1px); }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 260, flexShrink: 0, background: '#0e1225', borderRight: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Tilawah<span style={{ color: '#c9a84c' }}>Tracker</span></div>
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
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Target Khatam</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>١٢ رمضان ١٤٤٦</span>
        </div>

        <div style={{ padding: 32, flex: 1 }}>

          {/* Hitung mundur */}
          <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, padding: '24px 28px', marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { label: 'Sisa Hari', value: sisaHari, unit: 'hari', color: '#c9a84c' },
              { label: 'Sisa Juz', value: sisaJuz, unit: 'juz', color: '#fb7185' },
              { label: 'Juz / Hari', value: juzPerHari, unit: 'juz/hari', color: '#2dd4bf' },
              { label: 'Sudah Selesai', value: totalJuzDone, unit: 'juz', color: '#a78bfa' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>
                  {loading ? '—' : value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9095a8' }}>{unit}</div>
                <div style={{ fontSize: '0.68rem', color: '#6b7080', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

            {/* Target progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {targets.map(({ label, desc, current, total, unit, color, pct }) => (
                <div key={label} style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7080' }}>{desc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>{pct}%</div>
                      <div style={{ fontSize: '0.72rem', color: '#6b7080' }}>{current} / {total} {unit}</div>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: color, boxShadow: `0 0 10px ${color}50`, transition: 'width 0.8s ease' }} />
                  </div>
                  {pct >= 100 && (
                    <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#2dd4bf' }}>Target tercapai! Alhamdulillah</div>
                  )}
                </div>
              ))}
            </div>

            {/* Setting target */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Atur Target</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Halaman / Hari</label>
                    <input type="number" min={1} max={20} value={targetHalaman} onChange={e => setTargetHalaman(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Streak (hari)</label>
                    <input type="number" min={1} max={30} value={targetStreak} onChange={e => setTargetStreak(e.target.value)} />
                  </div>
                  <button className="btn-save" style={{ width: '100%' }} onClick={handleSaveTarget}>
                    {saved ? 'Tersimpan!' : 'Simpan Target'}
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.15rem', color: '#c9a84c', lineHeight: 1.7, marginBottom: 8 }}>
                  إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9095a8', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &quot;Sesungguhnya bersama kesulitan ada kemudahan&quot;
                </div>
                <div style={{ fontSize: '0.7rem', color: '#c9a84c', marginTop: 8, opacity: 0.7 }}>QS. Al-Insyirah: 6</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
