import type { ICourseRepository, CreateCourseParams, UpdateCourseParams } from '@/core/domain/repositories/ICourseRepository'
import type { Course, CourseCategory } from '@/core/domain/entities/Course'
import { courses } from '../sources/mock'
import { delay } from './helpers'

export class MockCourseRepository implements ICourseRepository {
  private items: Course[]

  constructor() {
    this.items = (courses as Course[]).map((c) => ({
      ...c,
      status: c.status ?? (c.isPublished ? 'Published' : 'Draft'),
      revenue: c.revenue ?? (c.isPublished ? c.price * c.totalStudents : 0),
    }))
  }

  async findAll(): Promise<Course[]> {
    await delay()
    return [...this.items]
  }

  async findBySlug(slug: string): Promise<Course | null> {
    await delay()
    return this.items.find((c) => c.slug === slug) ?? null
  }

  async findByCategory(category: CourseCategory): Promise<Course[]> {
    await delay()
    return this.items.filter((c) => c.category === category)
  }

  async findFeatured(): Promise<Course[]> {
    await delay()
    return this.items.filter((c) => c.isBestseller).slice(0, 3)
  }

  async create(params: CreateCourseParams): Promise<Course> {
    await delay()
    const course: Course = {
      id: String(Date.now()),
      slug: params.slug,
      title: params.title,
      description: params.description,
      instructor: params.instructor,
      instructorAvatar: undefined,
      thumbnail: params.thumbnail,
      price: params.price,
      originalPrice: params.originalPrice,
      discount: params.originalPrice ? Math.round((1 - params.price / params.originalPrice) * 100) : undefined,
      rating: 0,
      totalStudents: 0,
      duration: params.duration,
      level: params.level,
      category: params.category,
      tags: params.tags,
      isBestseller: params.isBestseller,
      isFree: params.price === 0,
      isPublished: params.status === 'Published',
      status: params.status,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    this.items.push(course)
    return course
  }

  async update(id: string, params: UpdateCourseParams): Promise<Course> {
    await delay()
    const index = this.items.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Course tidak ditemukan')

    const existing = this.items[index]
    const updated: Course = {
      ...existing,
      ...params,
      discount: params.originalPrice !== undefined && params.price !== undefined
        ? Math.round((1 - params.price / params.originalPrice) * 100)
        : existing.discount,
      isFree: params.price !== undefined ? params.price === 0 : existing.isFree,
      isPublished: params.status !== undefined ? params.status === 'Published' : existing.isPublished,
    }
    this.items[index] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    await delay()
    const index = this.items.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Course tidak ditemukan')
    this.items.splice(index, 1)
  }
}