import { describe, it, expect } from 'vitest'
import { MockAuthRepository } from '../MockAuthRepository'
import type { LoginParams, RegisterParams } from '@/core/domain/repositories/IAuthRepository'

describe('MockAuthRepository', () => {
  const repo = new MockAuthRepository()

  describe('login', () => {
    it('returns user for valid student credentials', async () => {
      const params: LoginParams = { email: 'user@codetrack.id', password: 'user123' }
      const result = await repo.login(params)
      expect(result).not.toBeNull()
      expect(result!.role).toBe('student')
    })

    it('returns user for valid admin credentials', async () => {
      const params: LoginParams = { email: 'admin@codetrack.id', password: 'admin123' }
      const result = await repo.login(params)
      expect(result).not.toBeNull()
      expect(result!.role).toBe('admin')
    })

    it('returns user for valid instructor credentials', async () => {
      const params: LoginParams = { email: 'instructor@codetrack.id', password: 'instructor123' }
      const result = await repo.login(params)
      expect(result).not.toBeNull()
      expect(result!.role).toBe('instructor')
    })

    it('returns null for invalid credentials', async () => {
      const params: LoginParams = { email: 'wrong@email.com', password: 'wrongpass' }
      const result = await repo.login(params)
      expect(result).toBeNull()
    })
  })

  describe('register', () => {
    it('creates user with student role', async () => {
      const params: RegisterParams = { name: 'Test', email: 'test@test.com', role: 'Student' }
      const result = await repo.register(params)
      expect(result.name).toBe('Test')
      expect(result.role).toBe('student')
    })

    it('creates user with instructor role', async () => {
      const params: RegisterParams = { name: 'Instructor', email: 'inst@test.com', role: 'Instructor' }
      const result = await repo.register(params)
      expect(result.role).toBe('instructor')
    })
  })
})