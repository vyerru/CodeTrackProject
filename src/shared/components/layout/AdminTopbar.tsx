import { useNavigate } from 'react-router'
import { Code2, Search, Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

export default function AdminTopbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-16 bg-indigo-900 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2">
          <Code2 className="w-7 h-7 text-primary-foreground/70" strokeWidth={2.5} />
          <span className="text-lg font-bold text-primary-foreground">CodeTrack</span>
          <span className="text-xs text-primary-foreground/70 bg-primary/80 rounded px-2 py-0.5">Admin</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/70" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg bg-primary-foreground/15 pl-10 pr-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/50 outline-none"
          />
        </div>

        <button className="relative p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium flex items-center justify-center">
            {user ? getInitials(user.name) : 'A'}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-primary-foreground">{user?.name}</div>
            <div className="text-xs text-primary-foreground/70 capitalize">{user?.role}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
