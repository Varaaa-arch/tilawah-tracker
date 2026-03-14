'use client'

import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { useUser } from '@/hooks/useUser'
import { getNavItems } from '@/lib/nav'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { profile } = useUser()
  const navItems = getNavItems(pathname)

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
          Tilawah<span style={{ color: '#c9a84c' }}>Tracker</span>
        </div>
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{profile?.full_name ?? '...'}</div>
          <div style={{ fontSize: '0.75rem', color: '#c9a84c' }}>@{profile?.username ?? '...'}</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7080', padding: '0 8px', marginBottom: 6 }}>
              {section}
            </div>
            {items.map(({ label, href, active, badge }) => (
              <a
                key={label}
                href={href}
                className={`nav-item${active ? ' active' : ''}`}
                onClick={onClose}
              >
                {label}
                {badge && (
                  <span style={{ marginLeft: 'auto', background: '#c9a84c', color: '#0c0f1a', fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                    {badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        
        <a 
          href="#"
          className="nav-item"
          style={{ color: '#f87171' }}
          onClick={e => { e.preventDefault(); handleLogout() }}
        >
          Keluar
        </a>
      </div>
    </aside>
  )
}