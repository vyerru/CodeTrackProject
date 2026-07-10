import { describe, it, expect, beforeEach } from 'vitest'
import { MockUserRepository } from '../MockUserRepository'
import type { CreateUserParams } from '@/core/domain/repositories/IUserRepository'

function makeRepo() {
  return new MockUserRepository()
}

describe('MockUserRepository', () => {
  let repo: MockUserRepository

  beforeEach(() => {
    repo = makeRepo()
  })

  describe('findAll', () => {
    it('returns all users', async () => {
      const users = await repo.findAll()
      expect(users.length).toBeGreaterThan(0)
    })

    it('filters by role', async () => {
      const admins = await repo.findAll('admin')
      expect(admins.every(u => u.role === 'admin')).toBe(true)
    })

    it('filters by student role', async () => {
      const students = await repo.findAll('student')
      expect(students.every(u => u.role === 'student')).toBe(true)
    })
  })

  describe('findById', () => {
    it('returns user by id', async () => {
      const all = await repo.findAll()
      const user = await repo.findById(all[0].id)
      expect(user).not.toBeNull()
      expect(user!.id).toBe(all[0].id)
    })

    it('returns null for non-existent id', async () => {
      expect(await repo.findById('99999')).toBeNull()
    })
  })

  describe('create', () => {
    const params: CreateUserParams = {
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'student',
      status: 'Active',
    }

    it('creates user with generated id', async () => {
      const user = await repo.create(params)
      expect(user.id).toBeTruthy()
      expect(user.name).toBe('New User')
    })

    it('persists in findAll', async () => {
      await repo.create(params)
      const all = await repo.findAll()
      expect(all.some(u => u.email === 'new@test.com')).toBe(true)
    })
  })

  describe('update', () => {
    it('updates user fields', async () => {
      const all = await repo.findAll()
      const updated = await repo.update(all[0].id, { name: 'Updated Name' })
      expect(updated.name).toBe('Updated Name')
    })
  })

  describe('delete', () => {
    it('removes user from list', async () => {
      const before = await repo.findAll()
      await repo.delete(before[0].id)
      const after = await repo.findAll()
      expect(after.length).toBe(before.length - 1)
    })
  })

  describe('getUserDetail', () => {
    it('returns user detail with enrolled courses for students', async () => {
      const students = await repo.findAll('student')
      if (students.length > 0) {
        const detail = await repo.getUserDetail(students[0].id)
        expect(detail).not.toBeNull()
        expect(detail!.enrolledCourses).toBeDefined()
        expect(detail!.enrolledCourses!.length).toBeGreaterThan(0)
      }
    })

    it('returns null for non-existent id', async () => {
      expect(await repo.getUserDetail('99999')).toBeNull()
    })
  })
})