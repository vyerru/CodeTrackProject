import type { Course, CourseCategory } from '../entities/Course'

export interface ICourseRepository {
  findAll(): Promise<Course[]>
  findBySlug(slug: string): Promise<Course | null>
  findByCategory(category: CourseCategory): Promise<Course[]>
  findFeatured(): Promise<Course[]>
}
