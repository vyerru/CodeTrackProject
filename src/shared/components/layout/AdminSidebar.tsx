import { useRef, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  CreditCard,
  Code2,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const menuSections = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ],
  },
  {
    label: 'Content',
    items: [
      { icon: FileText, label: 'Articles', path: '/admin/articles' },
      { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    ],
  },
  {
    label: 'Users',
    items: [
      { icon: Users, label: 'Users', path: '/admin/users' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    ],
  },
]

interface Props {
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function AdminSidebar({ collapsed, onToggleCollapse }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(0)

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosRef.current
    }
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="h-full bg-white border-r border-border flex flex-col">
      {/* Logo — juga berfungsi sebagai collapse toggle */}
      <div className="flex items-center px-4 h-16 border-b border-border/50 flex-shrink-0">
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex items-center gap-2.5 min-w-0 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
            collapsed
              ? 'p-2 -ml-2 hover:bg-gray-100'
              : 'p-1.5 -ml-1.5 hover:bg-gray-50'
          }`}
        >
          <Code2 className="w-7 h-7 text-indigo-600 flex-shrink-0" strokeWidth={2.5} />
          {!collapsed && (
            <span className="text-lg font-bold text-foreground truncate">CodeTrack</span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <div
        ref={scrollRef}
        onScroll={() => {
          if (scrollRef.current) scrollPosRef.current = scrollRef.current.scrollTop
        }}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
      >
        {menuSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path)
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary-foreground' : ''}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="border-t border-border/50 px-3 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div
            className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 cursor-default"
            title={collapsed ? user?.name : undefined}
          >
            {user ? getInitials(user.name) : 'A'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">{user?.name || 'Admin'}</div>
              <div className="text-xs text-muted-foreground capitalize truncate">{user?.role || 'admin'}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
