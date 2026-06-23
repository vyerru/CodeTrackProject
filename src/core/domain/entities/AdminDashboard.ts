export interface AdminKpiCard {
  label: string
  value: string
  trend: number
}

export interface AdminRevenueDataPoint {
  label: string
  revenue: number
  users: number
}

export interface AdminActivity {
  type: 'enrollment' | 'purchase' | 'registration' | 'completion' | 'review'
  user: string
  action: string
  time: string
  avatar: string
}

export interface AdminTopCourse {
  rank: number
  title: string
  category: string
  students: number
  revenue: number
  growth: number
}

export interface AdminAlert {
  id: string
  type: 'success' | 'warning' | 'info'
  message: string
}

export interface AdminDashboardTransaction {
  invoice: string
  customer: string
  course: string
  amount: number
  status: 'success' | 'pending' | 'failed'
  date: string
}

export interface AdminDashboardUser {
  avatar: string
  name: string
  email: string
  role: string
  time: string
}

export interface AdminDashboardData {
  kpiCards: AdminKpiCard[]
  revenueData: {
    '7D': AdminRevenueDataPoint[]
    '30D': AdminRevenueDataPoint[]
    '3M': AdminRevenueDataPoint[]
    '1Y': AdminRevenueDataPoint[]
  }
  recentActivity: AdminActivity[]
  pendingReviews: { course: string; count: number; pending: number }[]
  todayGoals: { label: string; current: number; target: number }[]
  secondaryMetrics: { label: string; value: string; change: string }[]
  latestTransactions: AdminDashboardTransaction[]
  newestUsers: AdminDashboardUser[]
  trafficSources: { name: string; value: number; color: string }[]
  deviceData: { device: string; count: number; color: string }[]
  topLocations: { city: string; count: number }[]
  alerts: AdminAlert[]
  topCourses: AdminTopCourse[]
}
