import { useState, useRef, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router'
import {
  Code2,
  ShoppingCart,
  Bell,
  LayoutDashboard,
  BookOpen,
  Receipt,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/commerce/store/cartStore'

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const menuItems = [
  { label: 'Courses', path: '/courses' },
  { label: 'Artikel', path: '/articles' },
  { label: 'Komunitas', path: '#' },
  { label: 'Pricing', path: '#' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Code2 className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
          <span className="text-lg font-bold text-gray-900">CodeTrack</span>
        </button>

        {/* Menu Tengah */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive && item.path !== '#'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Cart — user only */}
              {user.role === 'user' && (
                <button
                  onClick={() => navigate('/dashboard/cart')}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {/* Bell */}
              <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Avatar + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  {getInitials(user.name)}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    {/* Header */}
                    <div className="px-4 py-2">
                      <div className="font-semibold text-sm text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {user.role === 'user' ? (
                      <>
                        <DropdownItem icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => { navigate('/dashboard'); setDropdownOpen(false) }} />
                        <DropdownItem icon={<BookOpen size={16} />} label="My Courses" onClick={() => { navigate('/courses'); setDropdownOpen(false) }} />
                        <DropdownItem icon={<Receipt size={16} />} label="Transactions" onClick={() => { navigate('/dashboard/history'); setDropdownOpen(false) }} />
                        <DropdownItem icon={<Settings size={16} />} label="Settings" onClick={() => setDropdownOpen(false)} />
                      </>
                    ) : (
                      <>
                        <DropdownItem icon={<Shield size={16} />} label="Admin Dashboard" onClick={() => { navigate('/admin'); setDropdownOpen(false) }} />
                      </>
                    )}

                    <div className="border-t border-gray-100" />
                    <DropdownItem icon={<LogOut size={16} />} label="Logout" onClick={handleLogout} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/login')}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
              >
                Start Free Trial
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function DropdownItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-500">{icon}</span>
      {label}
    </button>
  )
}
