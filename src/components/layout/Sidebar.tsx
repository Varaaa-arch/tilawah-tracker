'use client'

import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useUser } from '@/hooks/useUser'
import { getNavItems } from '@/lib/nav'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { profile } = useUser()
  const navItems = getNavItems(pathname)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <>
      <style>{`
        .nav-item { display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;font-size:0.85rem;color:#9095a8;cursor:pointer;transition:all 0.18s;text-decoration:none;margin-bottom:2px;border:1px solid transparent; }
        .nav-item:hover { background:rgba(255,255,255,0.04);color:#e8e4d9; }
        .nav-item.active { background:rgba(201,168,76,0.12);color:#c9a84c;border-color:rgba(201,168,76,0.2); }
      `}</style>

      <aside style={{ width: 260, flexShrink: 0, background: '#0e1225', borderRight: '1px solid rgba(201,168,76,0.2)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>

        {/* Brand + user card */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
            Tilawah<span style={{ color: '#c9a84c' }}>Tracker</span>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{profile?.full_name ?? '...'}</div>
            <div style={{ fontSize: '0.75rem', color: '#c9a84c' }}>@{profile?.username ?? '...'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map(({ section, items }) => (
            <div key={section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7080', padding: '0 8px', marginBottom: 6 }}>{section}</div>
              {items.map(({ label, href, active, badge }) => (
                <a key={label} href={href} className={`nav-item${active ? ' active' : ''}`}>
                  {label}
                  {badge && (
                    <span style={{ marginLeft: 'auto', background: '#c9a84c', color: '#0c0f1a', fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{badge}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="#" className="nav-item" style={{ color: '#f87171' }} onClick={e => { e.preventDefault(); handleLogout() }}>
            Keluar
          </a>
        </div>
      </aside>
    </>
  )
}