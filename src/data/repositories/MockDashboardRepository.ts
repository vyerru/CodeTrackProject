import type { IDashboardRepository } from '@/core/domain/repositories/IDashboardRepository'
import type { DashboardData } from '@/core/domain/entities/Dashboard'
import { userDashboard } from '../sources/mock'
import { delay } from './helpers'

export class MockDashboardRepository implements IDashboardRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDashboardData(_userId: string): Promise<DashboardData> {
    await delay()
    return userDashboard as DashboardData
  }
}
