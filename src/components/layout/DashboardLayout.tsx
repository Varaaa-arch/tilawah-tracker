'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  title: string
  children: React.ReactNode
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-wrapper">
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</span>
          </div>
          <span
            className="hijri-badge"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: '0.9rem',
              color: '#c9a84c',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '4px 14px',
              borderRadius: 20
            }}
          >
            ١٢ رمضان ١٤٤٦
          </span>
        </div>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}