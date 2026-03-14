'use client'

import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  title: string
  children: React.ReactNode
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
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
        @media (max-width: 768px) { .main-content { margin-left:0 !important; } }
      `}</style>

      <Sidebar />

      <main className="main-content" style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar */}
        <div style={{ height: 60, background: '#0e1225', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 5 }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</span>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: '0.9rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '4px 14px', borderRadius: 20 }}>
            ١٢ رمضان ١٤٤٦
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: 32, flex: 1 }}>
          {children}
        </div>

      </main>
    </div>
  )
}