export type NavItem = {
  label: string
  href: string
  active?: boolean
  badge?: string
}

export type NavSection = {
  section: string
  items: NavItem[]
}

export function getNavItems(activePath: string): NavSection[] {
  return [
    {
      section: 'Utama', items: [
        { label: 'Dashboard', href: '/dashboard', active: activePath === '/dashboard' },
        { label: 'Progress Saya', href: '/progress', active: activePath === '/progress' },
        { label: 'Riwayat Bacaan', href: '/riwayat', active: activePath === '/riwayat' },
      ]
    },
    {
      section: 'Tilawah', items: [
        { label: 'Catat Bacaan', href: '/catat', active: activePath === '/catat', badge: 'Baru' },
        { label: 'Streak Saya', href: '/streak', active: activePath === '/streak' },
        { label: 'Target Khatam', href: '/target', active: activePath === '/target' },
      ]
    },
    {
      section: 'Akun', items: [
        { label: 'Profil Saya', href: '/profil', active: activePath === '/profil' },
      ]
    },
  ]
}