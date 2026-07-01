import type { IUserRepository, CreateUserParams, UpdateUserParams } from '@/core/domain/repositories/IUserRepository'
import type { User, UserRole, UserDetail } from '@/core/domain/entities/User'
import { users } from '../sources/mock'
import { delay } from './helpers'

interface DemoUser {
  email: string
  password: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  avatar?: string | null
  status: string
  lastActive: string
}

export class MockUserRepository implements IUserRepository {
  private items: User[]

  constructor() {
    this.items = (users as DemoUser[]).map((u, i) => ({
      id: String(i + 1),
      name: u.name,
      email: u.email,
      avatar: u.avatar ?? undefined,
      role: u.role,
      status: (u.status as 'Active' | 'Inactive') ?? 'Active',
      lastActive: u.lastActive,
      courseEnrolled: u.role === 'student' ? Math.floor(Math.random() * 8) + 1 : 0,
      createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T00:00:00Z`,
    }))
  }

  async findAll(role?: UserRole): Promise<User[]> {
    await delay()
    let result = [...this.items]
    if (role) result = result.filter((u) => u.role === role)
    return result
  }

  async findById(id: string): Promise<User | null> {
    await delay()
    return this.items.find((u) => u.id === id) ?? null
  }

  async create(params: CreateUserParams): Promise<User> {
    await delay()
    const user: User = {
      id: String(Date.now()),
      name: params.name,
      email: params.email,
      avatar: params.avatar || undefined,
      role: params.role,
      status: params.status,
      lastActive: new Date().toISOString(),
      courseEnrolled: 0,
      createdAt: new Date().toISOString(),
    }
    this.items.push(user)
    return user
  }

  async update(id: string, params: UpdateUserParams): Promise<User> {
    await delay()
    const index = this.items.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User tidak ditemukan')
    this.items[index] = { ...this.items[index], ...params }
    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    await delay()
    const index = this.items.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User tidak ditemukan')
    this.items.splice(index, 1)
  }

  async getUserDetail(id: string): Promise<UserDetail | null> {
    await delay()
    const user = this.items.find((u) => u.id === id)
    if (!user) return null

    const detail: UserDetail = {
      ...user,
      totalLearningTime: user.role === 'student' ? Math.floor(Math.random() * 200) + 10 : undefined,
      certificatesEarned: user.role === 'student' ? Math.floor(Math.random() * 5) : undefined,
      currentStreak: user.role === 'student' ? Math.floor(Math.random() * 30) : undefined,
      enrolledCourses: user.role === 'student'
        ? [
            { title: 'Complete Web Development Bootcamp', progress: 75 },
            { title: 'Advanced React & TypeScript', progress: 30 },
            { title: 'Python for Data Science', progress: 100 },
          ]
        : undefined,
      recentActivities: [
        { type: 'completed', title: 'Menyelesaikan modul "React Hooks"', time: '2 hours ago' },
        { type: 'quiz', title: 'Quiz JavaScript Fundamentals - Nilai 90/100', time: '1 day ago' },
        { type: 'forum', title: 'Membuat thread "Best practices useEffect?"', time: '3 days ago' },
        { type: 'certificate', title: 'Mendapatkan sertifikat Python for Data Science', time: '1 week ago' },
      ],
    }
    return detail
  }
}