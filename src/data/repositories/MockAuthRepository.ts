import type { IAuthRepository, LoginParams, RegisterParams, LoginResult } from '@/core/domain/repositories/IAuthRepository'
import { users } from '../sources/mock'
import { delay } from './helpers'

interface DemoUser {
  email: string
  password: string
  name: string
  role: 'user' | 'admin'
}

export class MockAuthRepository implements IAuthRepository {
  async login(params: LoginParams): Promise<LoginResult | null> {
    await delay(800)
    const user = (users as DemoUser[]).find(
      u => u.email === params.email && u.password === params.password
    )
    if (!user) return null
    return {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  async register(params: RegisterParams): Promise<LoginResult> {
    await delay(800)
    return {
      id: crypto.randomUUID(),
      name: params.name,
      email: params.email,
      role: params.role === 'Instructor' ? 'admin' : 'user',
    }
  }
}
