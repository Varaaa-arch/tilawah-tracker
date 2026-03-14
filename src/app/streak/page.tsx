'use client'

import { useProgress } from '@/hooks/useProgress'
import DashboardLayout from '@/components/layout/DashboardLayout'

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
    calDays.push({ date: d, hasRead: readDates.has(key), isToday: i === today.getDate(), isFuture: d > today })
  }

  const totalReadDays = readDates.size

  return (
    <DashboardLayout title="Streak Saya">
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
        <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Kalender — {MONTHS[today.getMonth()]} {today.getFullYear()}</div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 16 }}>Status Streak</div>
            {[
              { label: 'Streak sekarang', value: `${streak?.current_streak ?? 0} hari`, color: '#c9a84c' },
              { label: 'Streak terbaik', value: `${streak?.longest_streak ?? 0} hari`, color: '#2dd4bf' },
              { label: 'Total hari baca', value: `${totalReadDays} hari`, color: '#a78bfa' },
              { label: 'Terakhir baca', value: streak?.last_read_at ? new Date(streak.last_read_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-', color: '#e8e4d9' },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: '0.82rem' }}>
                <span style={{ color: '#9095a8' }}>{label}</span>
                <span style={{ color, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '20px 22px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.2rem', color: '#c9a84c', lineHeight: 1.7, marginBottom: 8 }}>وَاذْكُر رَّبَّكَ كَثِيرًا</div>
            <div style={{ fontSize: '0.78rem', color: '#9095a8', lineHeight: 1.6, fontStyle: 'italic' }}>&quot;Dan ingatlah Tuhanmu sebanyak-banyaknya&quot;</div>
            <div style={{ fontSize: '0.7rem', color: '#c9a84c', marginTop: 8, opacity: 0.7 }}>QS. Ali Imran: 41</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
