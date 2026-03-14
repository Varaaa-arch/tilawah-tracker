'use client'

import { useState } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function RiwayatPage() {
  const { progress, loading } = useProgress()

  const [filterJuz, setFilterJuz] = useState('semua')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    await supabase.from('progress').delete().eq('id', id)
    window.location.reload()
  }

  const filtered = filterJuz === 'semua' ? progress : progress.filter(p => p.juz_number === Number(filterJuz))

  const grouped = filtered.reduce<Record<string, typeof progress>>((acc, log) => {
    const key = log.read_at
    if (!acc[key]) acc[key] = []
    acc[key].push(log)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <DashboardLayout title="Riwayat Bacaan">
      <style>{`
        select { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 12px;font-size:0.82rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        select:focus { border-color:#c9a84c; }
        select option { background:#11152a; }
        .log-row { display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04); }
        .log-row:last-child { border-bottom:none; }
        .delete-btn { background:none;border:1px solid rgba(248,113,113,0.2);border-radius:6px;color:#f87171;font-size:0.75rem;padding:5px 10px;cursor:pointer;font-family:inherit;transition:all 0.2s;opacity:0; }
        .log-row:hover .delete-btn { opacity:1; }
        .delete-btn:hover { background:rgba(248,113,113,0.1); }
      `}</style>

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
              <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)', borderTop: di !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7080', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 20 }}>
                    {grouped[date].length} catatan
                  </span>
                </div>
              </div>
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
                      <button className="delete-btn" onClick={() => handleDelete(id)} disabled={deleting === id}>
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
    </DashboardLayout>
  )
}