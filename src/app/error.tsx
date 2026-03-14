'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Home } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#0c0f1a', color: '#e8e4d9', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:0.6} }
        .content { animation: fadeUp 0.8s ease both; }
        .orb-err { position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(248,113,113,0.06) 0%,transparent 70%);top:-150px;right:-150px;animation:pulse 8s ease-in-out infinite; }
        .btn-retry { display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s; }
        .btn-retry:hover { opacity:0.9;transform:translateY(-2px); }
        .btn-home { display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;color:#9095a8;cursor:pointer;transition:all 0.2s; }
        .btn-home:hover { background:rgba(255,255,255,0.07);color:#e8e4d9; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 70% 20%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(1px 1px at 50% 70%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 80% 60%,rgba(255,255,255,0.3) 0%,transparent 100%)' }} />
      <div className="orb-err" />

      <div className="content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 480 }}>

        {/* Icon */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.2rem', color: '#c9a84c', marginBottom: 16, opacity: 0.7 }}>
          حدث خطأ ما
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>
          Terjadi Kesalahan
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6b7080', lineHeight: 1.7, marginBottom: 12 }}>
          Maaf, ada sesuatu yang tidak berjalan dengan baik.<br/>Coba refresh halaman atau kembali ke dashboard.
        </p>

        {error?.message && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 28, fontSize: '0.78rem', color: '#f87171', fontFamily: 'monospace' }}>
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
          <button className="btn-home" onClick={() => router.push('/dashboard')}>
            <Home size={16} />
            Ke Dashboard
          </button>
          <button className="btn-retry" onClick={reset}>
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  )
}
