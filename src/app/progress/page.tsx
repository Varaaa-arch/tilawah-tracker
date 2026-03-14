'use client'

import { useProgress } from '@/hooks/useProgress'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProgressPage() {
  const { progress, streak, loading, completedJuz, totalJuzDone } = useProgress()
  const pctKhatam = Math.round((totalJuzDone / 30) * 100)

  return (
    <DashboardLayout title="Progress Saya">
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
                  <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>Juz {juzNum}</div>
                  <div style={{ fontSize: '0.65rem', color: isDone ? '#c9a84c' : '#6b7080' }}>
                    {isDone ? 'Selesai' : isActive ? `${totalPages} hal` : 'Belum'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
          {[{ color: '#c9a84c', label: 'Selesai' }, { color: 'rgba(201,168,76,0.4)', label: 'Sedang' }, { color: 'rgba(255,255,255,0.06)', label: 'Belum' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#9095a8' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />{label}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}