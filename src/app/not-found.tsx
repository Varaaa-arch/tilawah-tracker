'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#0c0f1a', color: '#e8e4d9', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes floatMoon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:0.6} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .moon-float { animation: floatMoon 4s ease-in-out infinite; }
        .orb-1 { position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%);top:-200px;left:-200px;animation:pulse 8s ease-in-out infinite; }
        .orb-2 { position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(45,212,191,0.05) 0%,transparent 70%);bottom:-150px;right:-150px;animation:pulse 10s ease-in-out infinite reverse; }
        .content { animation: fadeUp 0.8s ease both; }
        .btn-home { display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:linear-gradient(135deg,#c9a84c,#b8922e);border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s;box-shadow:0 4px 20px rgba(201,168,76,0.25); }
        .btn-home:hover { opacity:0.9;transform:translateY(-2px); }
        .btn-back { display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;color:#9095a8;cursor:pointer;transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.07);color:#e8e4d9; }
      `}</style>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 15% 20%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 40% 10%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 70% 15%,rgba(255,255,255,0.7) 0%,transparent 100%),radial-gradient(1px 1px at 85% 30%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(1px 1px at 25% 55%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(1px 1px at 60% 70%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(1px 1px at 90% 60%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 10% 80%,rgba(255,255,255,0.3) 0%,transparent 100%)' }} />
      <div className="orb-1" />
      <div className="orb-2" />

      {/* Mosque silhouette */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 0.07 }}>
        <svg viewBox="0 0 800 300" fill="none" style={{ width: '100%', maxWidth: 900 }}>
          <rect x="0" y="270" width="800" height="30" fill="#c9a84c"/>
          <ellipse cx="400" cy="160" rx="90" ry="85" fill="#c9a84c"/>
          <rect x="310" y="160" width="180" height="110" fill="#c9a84c"/>
          <ellipse cx="220" cy="200" rx="55" ry="50" fill="#c9a84c"/>
          <rect x="165" y="200" width="110" height="70" fill="#c9a84c"/>
          <ellipse cx="580" cy="200" rx="55" ry="50" fill="#c9a84c"/>
          <rect x="525" y="200" width="110" height="70" fill="#c9a84c"/>
          <ellipse cx="100" cy="230" rx="35" ry="30" fill="#c9a84c"/>
          <rect x="65" y="230" width="70" height="40" fill="#c9a84c"/>
          <ellipse cx="700" cy="230" rx="35" ry="30" fill="#c9a84c"/>
          <rect x="665" y="230" width="70" height="40" fill="#c9a84c"/>
          <rect x="155" y="100" width="18" height="170" fill="#c9a84c"/>
          <polygon points="164,80 155,110 173,110" fill="#c9a84c"/>
          <rect x="627" y="100" width="18" height="170" fill="#c9a84c"/>
          <polygon points="636,80 627,110 645,110" fill="#c9a84c"/>
        </svg>
      </div>

      {/* Content */}
      <div className="content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 480 }}>

        {/* Moon */}
        <div className="moon-float" style={{ width: 80, height: 80, margin: '0 auto 32px' }}>
          <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.4))' }}>
            <path d="M65 20 C45 20,28 37,28 57 C28 77,45 94,65 94 C52 88,43 74,43 57 C43 40,52 26,65 20Z" fill="#c9a84c"/>
            <circle cx="72" cy="28" r="4" fill="#e8c97a" opacity="0.6"/>
            <circle cx="60" cy="18" r="2.5" fill="#e8c97a" opacity="0.4"/>
          </svg>
        </div>

        {/* 404 */}
        <div style={{ fontFamily: 'Amiri, serif', fontSize: '7rem', fontWeight: 700, color: '#c9a84c', lineHeight: 1, marginBottom: 8, textShadow: '0 0 60px rgba(201,168,76,0.3)' }}>
          404
        </div>

        <div style={{ fontFamily: 'Amiri, serif', fontSize: '1.4rem', color: '#c9a84c', marginBottom: 16, opacity: 0.8 }}>
          الصفحة غير موجودة
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, color: '#e8e4d9' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6b7080', lineHeight: 1.7, marginBottom: 36 }}>
          Sepertinya halaman yang kamu cari tidak ada.<br/>Mungkin sudah dipindah atau salah URL.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-back" onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Kembali
          </button>
          <button className="btn-home" onClick={() => router.push('/dashboard')}>
            <Home size={16} />
            Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}