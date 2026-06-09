import { Navigate } from 'react-router'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { UserRole } from '@/shared/types'

interface Props {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <>{children}</>
}
