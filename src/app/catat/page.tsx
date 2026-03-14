'use client'

import { useState } from 'react'
import { useProgress } from '@/hooks/useProgress'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function CatatPage() {
  const { progress, saveProgress, completedJuz } = useProgress()

  const [selectedJuz, setSelectedJuz] = useState('1')
  const [pages, setPages] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function handleSave() {
    if (!pages) return
    setSaving(true)
    setSaveMsg('')
    const { error } = await saveProgress(Number(selectedJuz), Number(pages), date)
    if (error) {
      setSaveMsg('Gagal menyimpan, coba lagi.')
    } else {
      setSaveMsg('Progress tersimpan!')
      setPages('')
      setNotes('')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const nextJuz = (() => {
    for (let i = 1; i <= 30; i++) {
      if (!completedJuz.includes(i)) return i
    }
    return 30
  })()

  return (
    <DashboardLayout title="Catat Bacaan">
      <style>{`
        select, input[type="number"], input[type="date"], textarea { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;font-size:0.88rem;color:#e8e4d9;font-family:inherit;outline:none;transition:border-color 0.2s; }
        select:focus, input[type="number"]:focus, input[type="date"]:focus, textarea:focus { border-color:#c9a84c; }
        select option { background:#11152a; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        textarea { resize: vertical; min-height: 90px; }
        .btn-primary { width:100%;padding:13px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:10px;font-family:inherit;font-size:0.92rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s;box-shadow:0 4px 16px rgba(201,168,76,0.2); }
        .btn-primary:hover { opacity:0.9;transform:translateY(-1px); }
        .btn-primary:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
        .juz-btn { padding:8px 4px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);color:#6b7080;font-size:0.72rem;font-weight:600;cursor:pointer;transition:all 0.15s;font-family:inherit;text-align:center; }
        .juz-btn:hover { border-color:rgba(201,168,76,0.3);color:#c9a84c; }
        .juz-btn.done { background:rgba(201,168,76,0.1);border-color:rgba(201,168,76,0.2);color:#c9a84c; }
        .juz-btn.selected { background:rgba(201,168,76,0.25);border-color:#c9a84c;color:#e8c97a;box-shadow:0 0 8px rgba(201,168,76,0.3); }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7080', marginBottom: 4 }}>Lanjutkan dari</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#c9a84c' }}>Juz {nextJuz}</div>
            </div>
            <button onClick={() => setSelectedJuz(String(nextJuz))} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', color: '#c9a84c', cursor: 'pointer', fontFamily: 'inherit' }}>
              Pilih Juz {nextJuz}
            </button>
          </div>

          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Form Catatan Bacaan</div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Juz</label>
                  <select value={selectedJuz} onChange={e => setSelectedJuz(e.target.value)}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i} value={String(i + 1)}>Juz {i + 1} {completedJuz.includes(i + 1) ? '✓' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tanggal</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Halaman Dibaca <span style={{ color: '#4a4e5e', textTransform: 'none', letterSpacing: 0 }}>(maks. 20 hal)</span>
                </label>
                <input type="number" placeholder="Contoh: 8" min={1} max={20} value={pages} onChange={e => setPages(e.target.value)} />
                {pages && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (Number(pages) / 20) * 100)}%`, borderRadius: 99, background: Number(pages) >= 20 ? '#2dd4bf' : '#c9a84c', transition: 'width 0.3s ease' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7080', marginTop: 5 }}>
                      {Number(pages) >= 20 ? 'Juz selesai!' : `${20 - Number(pages)} halaman lagi untuk menyelesaikan juz ini`}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b7080', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Catatan <span style={{ color: '#4a4e5e', textTransform: 'none', letterSpacing: 0 }}>(opsional)</span>
                </label>
                <textarea placeholder="Contoh: Baca setelah subuh, alhamdulillah lancar..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <button className="btn-primary" onClick={handleSave} disabled={saving || !pages}>
                {saving ? 'Menyimpan...' : 'Simpan Catatan'}
              </button>

              {saveMsg && (
                <p style={{ fontSize: '0.82rem', marginTop: 12, textAlign: 'center', color: saveMsg.includes('tersimpan') ? '#2dd4bf' : '#f87171' }}>{saveMsg}</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Pilih Juz</div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
                {Array.from({ length: 30 }, (_, i) => {
                  const juzNum = i + 1
                  const isDone = completedJuz.includes(juzNum)
                  const isSelected = selectedJuz === String(juzNum)
                  return (
                    <button key={i} className={`juz-btn${isDone ? ' done' : ''}${isSelected ? ' selected' : ''}`} onClick={() => setSelectedJuz(String(juzNum))}>
                      {juzNum}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
                {[{ color: '#c9a84c', label: 'Selesai' }, { color: 'rgba(201,168,76,0.5)', label: 'Dipilih' }, { color: 'rgba(255,255,255,0.06)', label: 'Belum' }].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: '#6b7080' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />{label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#141828', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Catatan Terakhir</div>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              {progress.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#6b7080', padding: '12px 0' }}>Belum ada catatan.</p>
              ) : (
                progress.slice(0, 5).map(({ id, juz_number, pages_read, read_at }) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#c9a84c', flexShrink: 0 }}>J{juz_number}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>Juz {juz_number} — {pages_read} hal</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7080' }}>
                        {new Date(read_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    {pages_read >= 20 && <span style={{ fontSize: '0.68rem', color: '#2dd4bf', background: 'rgba(45,212,191,0.1)', padding: '2px 7px', borderRadius: 20 }}>Selesai</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}