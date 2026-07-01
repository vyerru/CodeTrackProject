export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type CourseCategory =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'Backend Development'
  | 'DevOps'
  | 'Cloud Computing'
  | 'Design'

export type CourseStatus = 'Published' | 'Draft'

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string
  thumbnail: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  totalStudents: number
  duration: number
  level: CourseLevel
  category: CourseCategory
  tags: string[]
  isBestseller?: boolean
  isFree?: boolean
  isPublished: boolean
  status?: CourseStatus
  revenue?: number
  createdAt: string
}

export interface EnrolledCourse {
  courseId: string
  progress: number
  currentLesson: string
  enrolledAt: string
  completedAt?: string
}
