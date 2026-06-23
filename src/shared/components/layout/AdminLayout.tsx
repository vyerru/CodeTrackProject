import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import AdminTopbar from './AdminTopbar'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const sidebarWidth = sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
  const contentMargin = sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarWidth} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden p-4 bg-card border-b border-border flex items-center justify-between">
          <span className="font-bold text-lg text-foreground">Admin</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className={`flex-1 transition-all duration-300 ease-in-out ${contentMargin}`}>
          <AdminTopbar />
          <main className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
