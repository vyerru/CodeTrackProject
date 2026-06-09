import type { IUserRepository } from '@/core/domain/repositories/IUserRepository'
import type { User, UserRole } from '@/core/domain/entities/User'
import { users } from '../sources/mock'
import { delay } from './helpers'

interface DemoUser {
  email: string
  password: string
  name: string
  role: 'user' | 'admin'
}

export class MockUserRepository implements IUserRepository {
  async findAll(role?: UserRole): Promise<User[]> {
    await delay(400)
    let list = users as DemoUser[]
    if (role) list = list.filter(u => u.role === role)
    return list.map((u, i) => ({
      id: String(i + 1),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: '2024-01-01T00:00:00Z',
    }))
  }

  async findById(id: string): Promise<User | null> {
    await delay(200)
    const list = users as DemoUser[]
    const idx = Number(id) - 1
    if (idx < 0 || idx >= list.length) return null
    const u = list[idx]
    return {
      id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: '2024-01-01T00:00:00Z',
    }
  }
}
