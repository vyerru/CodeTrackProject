import { useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  CreditCard,
  Settings,
} from 'lucide-react'

const menuSections = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ],
  },
  {
    label: 'Content Management',
    items: [
      { icon: FileText, label: 'Articles', path: '/admin/articles' },
      { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    ],
  },
  {
    label: 'User Management',
    items: [
      { icon: Users, label: 'Users', path: '/admin/users' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { icon: Settings, label: 'Settings', path: '#' },
    ],
  },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-full h-full bg-white border-r border-border flex flex-col pt-6">
      <div className="px-4 space-y-6 overflow-y-auto flex-1 pb-6">
        {/* Logo */}
        <div className="px-3 mb-6">
          <h2 className="text-lg font-bold text-foreground">CodeTrack</h2>
        </div>

        {menuSections.map((section) => (
          <div key={section.label}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path)
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path !== '#' && navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
