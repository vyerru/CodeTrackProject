import { createBrowserRouter } from 'react-router'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import UserLayout from '@/shared/components/layout/UserLayout'
import AdminLayout from '@/shared/components/layout/AdminLayout'
import ProtectedRoute from '@/shared/components/layout/ProtectedRoute'

import { lazy, Suspense } from 'react'
import PageSkeleton from '@/shared/components/common/PageSkeleton'

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const CourseCatalogPage = lazy(() => import('@/features/courses/pages/CourseCatalogPage'))
const CourseDetailPage = lazy(() => import('@/features/courses/pages/CourseDetailPage'))
const ArticlesPage = lazy(() => import('@/features/articles/pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('@/features/articles/pages/ArticleDetailPage'))
const CartPage = lazy(() => import('@/features/commerce/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/features/commerce/pages/CheckoutPage'))
const TransactionHistoryPage = lazy(() => import('@/features/commerce/pages/TransactionHistoryPage'))
const UserDashboardPage = lazy(() => import('@/features/user-dashboard/pages/UserDashboardPage'))
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
const ArticleManagementPage = lazy(() => import('@/features/admin/pages/ArticleManagementPage'))
const CourseManagementPage = lazy(() => import('@/features/admin/pages/CourseManagementPage'))
const UserManagementPage = lazy(() => import('@/features/admin/pages/UserManagementPage'))
const TransactionManagementPage = lazy(() => import('@/features/admin/pages/TransactionManagementPage'))
const NotFoundPage = lazy(() => import('@/features/not-found/pages/NotFoundPage'))

const S = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageSkeleton />}><Component /></Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: S(LandingPage) },
      { path: 'courses', element: S(CourseCatalogPage) },
      { path: 'courses/:slug', element: S(CourseDetailPage) },
      { path: 'articles', element: S(ArticlesPage) },
      { path: 'articles/:slug', element: S(ArticleDetailPage) },
    ]
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: S(LoginPage) },
      { path: 'register', element: S(RegisterPage) },
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute requiredRole="user"><UserLayout /></ProtectedRoute>,
    children: [
      { index: true, element: S(UserDashboardPage) },
      { path: 'cart', element: S(CartPage) },
      { path: 'checkout', element: S(CheckoutPage) },
      { path: 'history', element: S(TransactionHistoryPage) },
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: S(AdminDashboardPage) },
      { path: 'articles', element: S(ArticleManagementPage) },
      { path: 'courses', element: S(CourseManagementPage) },
      { path: 'users', element: S(UserManagementPage) },
      { path: 'transactions', element: S(TransactionManagementPage) },
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
