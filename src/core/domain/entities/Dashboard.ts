export interface UserStats {
  coursesEnrolled: number
  coursesInProgress: number
  overallCompletion: number
  learningTimeThisMonth: number
  learningTimeIncrease: number
  certificatesEarned: number
  certificatesToUnlock: number
  currentStreak: number
  longestStreak: number
}

export interface CourseProgress {
  title: string
  instructor?: string
  instructorAvatar?: string
  thumbnail: string
  currentLesson?: string
  progress: number
  hoursLeft?: number
}

export interface RecommendedCourse {
  title: string
  instructor: string
  thumbnail: string
  category: string
  level: string
  rating: number
  students: number
  duration: string
  price: number
}

export interface CalendarDay {
  intensity: 0 | 1 | 2 | 3 | 4
  lessons: number
  hours: number
}

export interface Activity {
  type: 'completed' | 'certificate' | 'quiz' | 'forum'
  title: string
  time: string
}

export interface Goal {
  title: string
  current: number
  target: number
}

export interface Deadline {
  course: string
  dueInDays: number
  progress: number
  urgency: 'high' | 'medium' | 'low'
}

export interface Badge {
  name: string
  icon: string
  date: string
}

export interface NextBadge {
  name: string
  progress: number
  description: string
}

export interface ForumTopic {
  title: string
  author: string
  replies: number
  views: number
}

export interface DashboardData {
  stats: UserStats
  currentCourse: CourseProgress
  inProgressCourses: Array<Omit<CourseProgress, 'instructor' | 'instructorAvatar' | 'currentLesson' | 'hoursLeft'>>
  recommendedCourses: RecommendedCourse[]
  streakData: {
    days: CalendarDay[]
    currentStreak: string
    longestStreak: string
    totalActiveDays: string
  }
  recentActivities: Activity[]
  monthlyGoals: Goal[]
  deadlines: Deadline[]
  badges: Badge[]
  nextBadge: NextBadge
  forumTopics: ForumTopic[]
}
