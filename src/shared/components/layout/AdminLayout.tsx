import { Outlet } from 'react-router'
import AdminTopbar from './AdminTopbar'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-[18%]">
        <AdminTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
