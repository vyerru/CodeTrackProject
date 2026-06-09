import type { DashboardData } from '../entities/Dashboard'

export interface IDashboardRepository {
  getDashboardData(userId: string): Promise<DashboardData>
}
