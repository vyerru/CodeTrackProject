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
  Menu,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/commerce/store/cartStore'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet'

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const menuItems = [
  { label: 'Courses', path: '/courses' },
  { label: 'Artikel', path: '/articles' },
  { label: 'Komunitas', path: null },
  { label: 'Pricing', path: null },
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
    <nav className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="px-6 pt-6 pb-2">
                <SheetTitle className="flex items-center gap-2">
                  <Code2 className="w-7 h-7 text-indigo-600" strokeWidth={2.5} />
                  <span className="text-lg font-bold text-foreground">CodeTrack</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="px-3 py-2 space-y-1">
                {menuItems.map((item) =>
                  item.path ? (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-foreground hover:bg-muted'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <SheetClose asChild>
                          <span className={isActive ? 'w-full' : 'w-full'}>{item.label}</span>
                        </SheetClose>
                      )}
                    </NavLink>
                  ) : (
                    <span
                      key={item.label}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground cursor-default select-none"
                      title="Coming soon"
                    >
                      {item.label}
                    </span>
                  )
                )}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-medium flex items-center justify-center">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                      </div>
                    </div>
                    <div className="border-t border-border pt-2 space-y-1">
                      {user.role === 'student' ? (
                        <>
                          <SheetClose asChild>
                            <MobileNavItem icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => { navigate('/dashboard'); }} />
                          </SheetClose>
                          <SheetClose asChild>
                            <MobileNavItem icon={<BookOpen size={16} />} label="My Courses" onClick={() => { navigate('/courses'); }} />
                          </SheetClose>
                          <SheetClose asChild>
                            <MobileNavItem icon={<Receipt size={16} />} label="Transactions" onClick={() => { navigate('/dashboard/history'); }} />
                          </SheetClose>
                        </>
                      ) : (
                        <SheetClose asChild>
                          <MobileNavItem icon={<Shield size={16} />} label="Admin Dashboard" onClick={() => { navigate('/admin'); }} />
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <MobileNavItem icon={<LogOut size={16} />} label="Logout" onClick={handleLogout} />
                      </SheetClose>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate('/auth/login')}
                        className="w-full py-2 border-2 border-border text-foreground rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-muted transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                      >
                        Login
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => navigate('/auth/register')}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/95 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                      >
                        Start Free Trial
                      </button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <button onClick={() => navigate('/')} className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
            <Code2 className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
            <span className="text-lg font-bold text-foreground">CodeTrack</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.label}
                to={item.path}
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    isActive ? 'text-indigo-600' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="text-sm font-medium text-muted-foreground cursor-default select-none"
                title="Coming soon"
              >
                {item.label}
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {user.role === 'student' && (
                <button
                  onClick={() => navigate('/dashboard/cart')}
                  className="relative p-2 text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                >
                  {getInitials(user.name)}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2">
                      <div className="font-semibold text-sm text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                    </div>

                    <div className="border-t border-border" />

                    {user.role === 'student' ? (
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

                    <div className="border-t border-border" />
                    <DropdownItem icon={<LogOut size={16} />} label="Logout" onClick={handleLogout} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/login')}
                className="px-6 py-2 border-2 border-border text-foreground rounded-lg text-sm font-medium hover:border-gray-400 hover:bg-muted transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/95 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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

function MobileNavItem({
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
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
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
      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  )
}