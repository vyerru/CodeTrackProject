import { describe, it, expect, beforeEach } from 'vitest'
import { MockCourseRepository } from '../MockCourseRepository'
import type { CreateCourseParams } from '@/core/domain/repositories/ICourseRepository'

function makeRepo() {
  return new MockCourseRepository()
}

describe('MockCourseRepository', () => {
  let repo: MockCourseRepository

  beforeEach(() => {
    repo = makeRepo()
  })

  describe('findAll', () => {
    it('returns all courses', async () => {
      const courses = await repo.findAll()
      expect(courses.length).toBeGreaterThan(0)
    })

    it('includes status field', async () => {
      const courses = await repo.findAll()
      expect(courses[0]).toHaveProperty('status')
    })
  })

  describe('findBySlug', () => {
    it('finds course by slug', async () => {
      const course = await repo.findBySlug('complete-web-development-bootcamp')
      expect(course).not.toBeNull()
      expect(course!.title).toContain('Web Development')
    })

    it('returns null for unknown slug', async () => {
      expect(await repo.findBySlug('nonexistent')).toBeNull()
    })
  })

  describe('findByCategory', () => {
    it('filters by category', async () => {
      const result = await repo.findByCategory('Web Development')
      expect(result.every(c => c.category === 'Web Development')).toBe(true)
    })
  })

  describe('findFeatured', () => {
    it('returns bestseller courses', async () => {
      const featured = await repo.findFeatured()
      expect(featured.length).toBeLessThanOrEqual(3)
      expect(featured.every(c => c.isBestseller)).toBe(true)
    })
  })

  describe('create', () => {
    const params: CreateCourseParams = {
      title: 'New Course',
      slug: 'new-course',
      description: 'A brand new course for testing purposes',
      category: 'Web Development',
      level: 'Beginner',
      instructor: 'Test Instructor',
      price: 199000,
      thumbnail: 'https://example.com/thumb.jpg',
      duration: 10,
      status: 'Draft',
      tags: ['test'],
      isBestseller: false,
    }

    it('creates course with generated id', async () => {
      const course = await repo.create(params)
      expect(course.id).toBeTruthy()
      expect(course.title).toBe('New Course')
    })

    it('sets isFree based on price', async () => {
      const course = await repo.create(params)
      expect(course.isFree).toBe(false)
    })

    it('sets isFree to true when price is 0', async () => {
      const free = await repo.create({ ...params, price: 0 })
      expect(free.isFree).toBe(true)
    })

    it('persists in findAll', async () => {
      await repo.create(params)
      const all = await repo.findAll()
      expect(all.some(c => c.title === 'New Course')).toBe(true)
    })
  })

  describe('update', () => {
    it('updates course fields', async () => {
      const all = await repo.findAll()
      const updated = await repo.update(all[0].id, { title: 'Updated Title' })
      expect(updated.title).toBe('Updated Title')
    })

    it('recalculates discount when price and originalPrice change', async () => {
      const all = await repo.findAll()
      const target = all[0]
      const updated = await repo.update(target.id, { price: 250000, originalPrice: 500000 })
      expect(updated.discount).toBe(50)
    })
  })

  describe('delete', () => {
    it('removes course from list', async () => {
      const before = await repo.findAll()
      await repo.delete(before[0].id)
      const after = await repo.findAll()
      expect(after.length).toBe(before.length - 1)
    })
  })
})