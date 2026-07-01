import type { Course, CourseCategory, CourseLevel, CourseStatus } from '../entities/Course'

export interface CreateCourseParams {
  title: string
  slug: string
  description: string
  category: CourseCategory
  level: CourseLevel
  instructor: string
  price: number
  originalPrice?: number
  thumbnail: string
  duration: number
  status: CourseStatus
  tags: string[]
  isBestseller: boolean
}

export interface UpdateCourseParams extends Partial<CreateCourseParams> {
  rating?: number
  totalStudents?: number
  isFree?: boolean
  revenue?: number
}

export interface ICourseRepository {
  findAll(): Promise<Course[]>
  findBySlug(slug: string): Promise<Course | null>
  findByCategory(category: CourseCategory): Promise<Course[]>
  findFeatured(): Promise<Course[]>
  create(params: CreateCourseParams): Promise<Course>
  update(id: string, params: UpdateCourseParams): Promise<Course>
  delete(id: string): Promise<void>
}
