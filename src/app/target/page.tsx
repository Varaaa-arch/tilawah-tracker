'use client'

import { useState } from 'react'
import { useProgress } from '@/hooks/useProgress'
import DashboardLayout from '@/components/layout/DashboardLayout'

const RAMADAN_END = new Date('2026-03-29')

export default function TargetPage() {
  const { streak, loading, totalJuzDone, todayPages } = useProgress()

  const [targetHalaman, setTargetHalaman] = useState('20')
  const [targetStreak, setTargetStreak] = useState('30')
  const [saved, setSaved] = useState(false)

  function handleSaveTarget() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sisaHari = Math.max(0, Math.ceil((RAMADAN_END.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  const sisaJuz = Math.max(0, 30 - totalJuzDone)
  const juzPerHari = sisaHari > 0 ? (sisaJuz / sisaHari).toFixed(1) : '0'

  const targets = [
    {
      label: "Khatam Al-Qur'an",
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
    <DashboardLayout title="Target Khatam">
      <style>{`
        input[type="number"] { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;font-size:0.88rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        input[type="number"]:focus { border-color:#c9a84c; }
        .btn-save { padding:10px 24px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:8px;font-family:inherit;font-size:0.85rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s; }
        .btn-save:hover { opacity:0.9;transform:translateY(-1px); }
      `}</style>

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
    </DashboardLayout>
  )
}
