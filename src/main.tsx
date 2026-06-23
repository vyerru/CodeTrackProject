import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectRepositories } from '@/core/domain/di'
import { setNetworkConfig } from '@/data/repositories/network'

setNetworkConfig({ minDelay: 800, maxDelay: 3000, failureRate: 0.25 })
import { MockCourseRepository } from '@/data/repositories/MockCourseRepository'
import { MockAuthRepository } from '@/data/repositories/MockAuthRepository'
import { MockArticleRepository } from '@/data/repositories/MockArticleRepository'
import { MockTransactionRepository } from '@/data/repositories/MockTransactionRepository'
import { MockDashboardRepository } from '@/data/repositories/MockDashboardRepository'
import { MockAdminDashboardRepository } from '@/data/repositories/MockAdminDashboardRepository'
import { MockUserRepository } from '@/data/repositories/MockUserRepository'
import '@fontsource-variable/geist'
import './index.css'
import App from './app/App'

injectRepositories({
  courseRepo: new MockCourseRepository(),
  authRepo: new MockAuthRepository(),
  articleRepo: new MockArticleRepository(),
  transactionRepo: new MockTransactionRepository(),
  dashboardRepo: new MockDashboardRepository(),
  adminDashboardRepo: new MockAdminDashboardRepository(),
  userRepo: new MockUserRepository(),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
