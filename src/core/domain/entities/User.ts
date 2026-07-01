export type UserRole = 'student' | 'instructor' | 'admin'
export type UserStatus = 'Active' | 'Inactive'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: UserRole
  status?: UserStatus
  lastActive?: string
  courseEnrolled?: number
  createdAt: string
}

export interface EnrolledCourseInfo {
  title: string
  progress: number
}

export interface UserDetail extends User {
  enrolledCourses?: EnrolledCourseInfo[]
  totalLearningTime?: number
  certificatesEarned?: number
  currentStreak?: number
  recentActivities?: { type: string; title: string; time: string }[]
}