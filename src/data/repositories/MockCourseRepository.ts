import type { ICourseRepository } from '@/core/domain/repositories/ICourseRepository'
import type { Course, CourseCategory } from '@/core/domain/entities/Course'
import { courses } from '../sources/mock'
import { delay } from './helpers'

export class MockCourseRepository implements ICourseRepository {
  async findAll(): Promise<Course[]> {
    await delay(400)
    return courses as Course[]
  }

  async findBySlug(slug: string): Promise<Course | null> {
    await delay(200)
    return (courses as Course[]).find(c => c.slug === slug) ?? null
  }

  async findByCategory(category: CourseCategory): Promise<Course[]> {
    await delay(300)
    return (courses as Course[]).filter(c => c.category === category)
  }

  async findFeatured(): Promise<Course[]> {
    await delay(300)
    return (courses as Course[]).filter(c => c.isBestseller).slice(0, 3)
  }
}
