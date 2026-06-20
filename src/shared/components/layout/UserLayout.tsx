import { Outlet } from 'react-router'
import Navbar from './Navbar'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  )
}
