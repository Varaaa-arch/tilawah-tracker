'use client'

import { useProgress } from '@/hooks/useProgress'
import Sidebar from '@/components/layout/Sidebar'

const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']
const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

export default function StreakPage() {
  const { progress, streak, loading } = useProgress()

  const readDates = new Set(progress.map(p => p.read_at))

  const today = new Date()
  const calDays: { date: Date; hasRead: boolean; isToday: boolean; isFuture: boolean }[] = []

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startPadding = startOfMonth.getDay()
  for (let i = 0; i < startPadding; i++) calDays.push({ date: new Date(0), hasRead: false, isToday: false, isFuture: true })

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), i)
    const key = d.toISOString().split('T')[0]
    calDays.push({
      date: d,
      hasRead: readDates.has(key),
      isToday: i === today.getDate(),
      isFuture: d > today,
    })
  }

  const totalReadDays = readDates.size

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
        .cal-cell { aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:500;transition:all 0.15s; }
        .cal-cell.read { background:rgba(201,168,76,0.2);border:1px solid rgba(201,168,76,0.3);color:#c9a84c;font-weight:700; }
        .cal-cell.today { border:2px solid #c9a84c;color:#c9a84c; }
        .cal-cell.today.read { background:rgba(201,168,76,0.3);box-shadow:0 0 10px rgba(201,168,76,0.3); }
        .cal-cell.future { color:#3a3e50; }
        .cal-cell.empty { background: transparent; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ height: 60, background: '#0e1225', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Streak Saya</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>١٢ رمضان ١٤٤٦</span>
        </div>

        <div style={{ padding: 32, flex: 1 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Streak Sekarang', value: streak?.current_streak ?? 0, unit: 'hari', accent: '#c9a84c' },
              { label: 'Streak Terbaik', value: streak?.longest_streak ?? 0, unit: 'hari', accent: '#2dd4bf' },
              { label: 'Total Hari Baca', value: totalReadDays, unit: 'hari', accent: '#a78bfa' },
            ].map(({ label, value, unit, accent }) => (
              <div key={label} style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
                <div style={{ fontSize: '3rem', fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 6, textShadow: `0 0 24px ${accent}40` }}>
                  {loading ? '—' : value}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9095a8' }}>{unit}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7080', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

            {/* Kalender */}
            <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Kalender — {MONTHS[today.getMonth()]} {today.getFullYear()}
                </div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', color: '#6b7080', padding: '4px 0', textTransform: 'uppercase' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                  {calDays.map((cell, i) => {
                    if (cell.date.getTime() === 0) return <div key={i} className="cal-cell empty" />
                    return (
                      <div key={i} className={`cal-cell${cell.hasRead ? ' read' : ''}${cell.isToday ? ' today' : ''}${cell.isFuture ? ' future' : ''}`}>
                        {cell.date.getDate()}
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                  {[
                    { color: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.3)', label: 'Baca' },
                    { color: 'transparent', border: '2px solid #c9a84c', label: 'Hari ini' },
                    { color: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', label: 'Tidak baca' },
                  ].map(({ color, border, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#9095a8' }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: color, border }} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info streak */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 16 }}>Status Streak</div>
                <div style={{ fontSize: '0.82rem', color: '#9095a8', lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Streak sekarang</span>
                    <span style={{ color: '#c9a84c', fontWeight: 600 }}>{streak?.current_streak ?? 0} hari</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Streak terbaik</span>
                    <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{streak?.longest_streak ?? 0} hari</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span>Total hari baca</span>
                    <span style={{ color: '#a78bfa', fontWeight: 600 }}>{totalReadDays} hari</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Terakhir baca</span>
                    <span style={{ color: '#e8e4d9', fontWeight: 600 }}>
                      {streak?.last_read_at
                        ? new Date(streak.last_read_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '20px 22px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.2rem', color: '#c9a84c', lineHeight: 1.7, marginBottom: 8 }}>
                  وَاذْكُر رَّبَّكَ كَثِيرًا
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9095a8', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &quot;Dan ingatlah Tuhanmu sebanyak-banyaknya&quot;
                </div>
                <div style={{ fontSize: '0.7rem', color: '#c9a84c', marginTop: 8, opacity: 0.7 }}>QS. Ali Imran: 41</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}