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
    <aside className="w-[18%] fixed left-0 top-0 h-screen bg-white border-r border-black/10 z-30 pt-6">
      <div className="px-4 space-y-6 overflow-y-auto h-full pb-6">
        {menuSections.map((section) => (
          <div key={section.label}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path)
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path !== '#' && navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-indigo-50'
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
