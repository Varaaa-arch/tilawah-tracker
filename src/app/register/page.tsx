'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/auth'
import { Eye, EyeOff, BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { error } = await register(email, password, username, fullName)
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0c0f1a', color: '#e8e4d9', overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
        @keyframes floatMoon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        .left-content { animation: fadeUp 0.8s ease both; }
        .right-panel { animation: slideIn 0.7s ease both; }
        .orb-1 { position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%);top:-80px;left:-80px;animation:pulse 6s ease-in-out infinite; }
        .orb-2 { position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(45,212,191,0.08) 0%,transparent 70%);bottom:-60px;right:-60px;animation:pulse 8s ease-in-out infinite reverse; }
        .moon-wrap { animation: floatMoon 4s ease-in-out infinite; }
        .auth-input { width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 16px;font-size:0.9rem;font-family:'Plus Jakarta Sans',sans-serif;color:#e8e4d9;outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
        .auth-input::placeholder { color:rgba(255,255,255,0.2); }
        .auth-input:focus { border-color:#c9a84c;box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
        .btn-register { width:100%;padding:13px;background:linear-gradient(135deg,#c9a84c 0%,#b8922e 100%);border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:600;color:#0c0f1a;cursor:pointer;transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 20px rgba(201,168,76,0.25);margin-top:8px; }
        .btn-register:hover { opacity:0.92;transform:translateY(-1px);box-shadow:0 6px 28px rgba(201,168,76,0.35); }
        .btn-register:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
        .eye-btn { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:#7a7d8f;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px; }
        .eye-btn:hover { color:#c9a84c; }
        @media (max-width: 768px) { .left-panel { display: none !important; } .right-panel { width: 100% !important; } }
      `}</style>

      {/* LEFT */}
      <div className="left-panel" style={{ flex: 1.1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(160deg, #0a0d1c 0%, #111835 50%, #0d1520 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 15% 20%,rgba(255,255,255,0.8) 0%,transparent 100%),radial-gradient(1px 1px at 40% 10%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 70% 15%,rgba(255,255,255,0.9) 0%,transparent 100%),radial-gradient(1px 1px at 85% 30%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(1px 1px at 25% 55%,rgba(255,255,255,0.7) 0%,transparent 100%),radial-gradient(1px 1px at 60% 45%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 90% 60%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 10% 80%,rgba(255,255,255,0.5) 0%,transparent 100%)' }} />
        <div className="orb-1" /><div className="orb-2" />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 0.18 }}>
          <svg viewBox="0 0 800 300" fill="none" style={{ width: '100%', maxWidth: 640 }}>
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
            <ellipse cx="400" cy="185" rx="18" ry="22" fill="#0d1520"/>
            <ellipse cx="350" cy="220" rx="12" ry="16" fill="#0d1520"/>
            <ellipse cx="450" cy="220" rx="12" ry="16" fill="#0d1520"/>
            <ellipse cx="220" cy="215" rx="10" ry="14" fill="#0d1520"/>
            <ellipse cx="580" cy="215" rx="10" ry="14" fill="#0d1520"/>
          </svg>
        </div>

        <div className="left-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 48px' }}>
          <div className="moon-wrap" style={{ width: 100, height: 100, margin: '0 auto 32px' }}>
            <svg viewBox="0 0 100 100" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.5))' }}>
              <path d="M65 20 C45 20,28 37,28 57 C28 77,45 94,65 94 C52 88,43 74,43 57 C43 40,52 26,65 20Z" fill="#c9a84c"/>
              <circle cx="72" cy="28" r="4" fill="#e8c97a" opacity="0.6"/>
              <circle cx="60" cy="18" r="2.5" fill="#e8c97a" opacity="0.4"/>
            </svg>
          </div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8c97a', opacity: 0.7, marginBottom: 20 }}>Ramadan Kareem 1446 H</p>
          <p style={{ fontFamily: 'Amiri, serif', fontSize: '2.8rem', color: '#c9a84c', lineHeight: 1.4, marginBottom: 12, textShadow: '0 0 40px rgba(201,168,76,0.4)' }}>رَمَضَان كَرِيم</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e4d9', marginBottom: 12, lineHeight: 1.2 }}>Mulai perjalanan <span style={{ color: '#c9a84c' }}>Tilawah-mu</span></h1>
          <p style={{ fontSize: '0.9rem', color: '#7a7d8f', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>Daftar sekarang dan mulai catat progress bacaan Al-Qur&apos;an kamu hari ini.</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-panel" style={{ width: 440, flexShrink: 0, background: '#11152a', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px', position: 'relative', borderLeft: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c' }}>
            <BookOpen size={18} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Tilawah<span style={{ color: '#c9a84c' }}>Tracker</span></span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: 6 }}>Buat Akun Baru</h2>
        <p style={{ fontSize: '0.85rem', color: '#7a7d8f', marginBottom: 28, lineHeight: 1.6 }}>Isi data di bawah untuk memulai<br/>perjalanan tilawah Ramadan-mu.</p>

        {error && (
          <p style={{ fontSize: '0.85rem', color: '#f87171', marginBottom: 16, background: 'rgba(248,113,113,0.1)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)' }}>{error}</p>
        )}

        {[
          { label: 'Nama Lengkap', type: 'text', placeholder: 'Ahmad Fauzi', value: fullName, onChange: setFullName },
          { label: 'Username', type: 'text', placeholder: 'ahmadfauzi', value: username, onChange: setUsername },
          { label: 'Email', type: 'email', placeholder: 'nama@email.com', value: email, onChange: setEmail },
        ].map(({ label, type, placeholder, value, onChange }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#7a7d8f', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
            <input className="auth-input" type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
          </div>
        ))}

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#7a7d8f', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input className="auth-input" type={showPwd ? 'text' : 'password'} placeholder="Min. 8 karakter" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
            <button className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button className="btn-register" onClick={handleRegister} disabled={loading} style={{ marginTop: 20 }}>
          {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#7a7d8f', marginTop: 24 }}>
          Udah punya akun? <a href="/login" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}>Masuk di sini</a>
        </p>
      </div>
    </div>
  )
}
