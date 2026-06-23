import type { IAdminDashboardRepository } from '@/core/domain/repositories/IAdminDashboardRepository'
import type { AdminDashboardData } from '@/core/domain/entities/AdminDashboard'
import { adminDashboard } from '../sources/mock'
import { delay } from './helpers'

export class MockAdminDashboardRepository implements IAdminDashboardRepository {
  async getAdminDashboardData(): Promise<AdminDashboardData> {
    await delay()
    return adminDashboard as unknown as AdminDashboardData
  }
}
