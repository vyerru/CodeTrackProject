import type { AdminDashboardData } from '../entities/AdminDashboard'

export interface IAdminDashboardRepository {
  getAdminDashboardData(): Promise<AdminDashboardData>
}
