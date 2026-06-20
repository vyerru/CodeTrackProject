import WelcomeHeader from '../components/WelcomeHeader'
import StatCards from '../components/StatCards'
import ContinueLearningSection from '../components/ContinueLearningSection'
import RecommendedCoursesSection from '../components/RecommendedCoursesSection'
import StreakCalendar from '../components/StreakCalendar'
import RecentActivitySection from '../components/RecentActivitySection'
import MonthlyGoalsCard from '../components/MonthlyGoalsCard'
import UpcomingDeadlines from '../components/UpcomingDeadlines'
import AchievementsCard from '../components/AchievementsCard'
import CommunityCard from '../components/CommunityCard'
import QuickActionsCard from '../components/QuickActionsCard'
import { useUserDashboard } from '../hooks/useUserDashboard'
import DashboardSkeleton from '../components/DashboardSkeleton'

export default function UserDashboardPage() {
  const { data, isLoading, error } = useUserDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 font-medium">{error ?? 'Failed to load dashboard data'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeHeader completionPercent={data.stats.overallCompletion} streak={data.stats.currentStreak} />
      <StatCards stats={data.stats} />
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-[65%_35%] gap-8">
          <div className="space-y-6">
            <ContinueLearningSection
              currentCourse={data.currentCourse}
              inProgressCourses={data.inProgressCourses}
            />
            <RecommendedCoursesSection courses={data.recommendedCourses} />
            <StreakCalendar
              days={data.streakData.days}
              currentStreak={data.streakData.currentStreak}
              longestStreak={data.streakData.longestStreak}
              totalActiveDays={data.streakData.totalActiveDays}
            />
            <RecentActivitySection activities={data.recentActivities} />
          </div>
          <div className="space-y-6">
            <MonthlyGoalsCard goals={data.monthlyGoals} />
            <UpcomingDeadlines deadlines={data.deadlines} />
            <AchievementsCard badges={data.badges} nextBadge={data.nextBadge} />
            <CommunityCard topics={data.forumTopics} />
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  )
}
