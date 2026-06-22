import { BookOpen, Clock, Award, Flame, TrendingUp } from 'lucide-react'
import type { UserStats } from '@/shared/types'

interface Props {
  stats: UserStats
}

export default function StatCards({ stats }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card
          icon={<BookOpen className="w-10 h-10 text-indigo-600" />}
          iconBg="bg-indigo-100"
          value={String(stats.coursesEnrolled)}
          label="Courses Enrolled"
          sub={<span className="text-green-600">{stats.coursesInProgress} in progress</span>}
          bottom={
            <div className="space-y-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${stats.overallCompletion}%` }} />
              </div>
              <p className="text-xs text-gray-500">{stats.overallCompletion}% completed overall</p>
            </div>
          }
        />
        <Card
          icon={<Clock className="w-10 h-10 text-green-600" />}
          iconBg="bg-green-100"
          value={`${stats.learningTimeThisMonth}h`}
          label="This Month"
          sub={
            <span className="text-green-600 inline-flex items-center gap-1">
              <TrendingUp size={14} />+{stats.learningTimeIncrease}% vs last month
            </span>
          }
        />
        <Card
          icon={<Award className="w-10 h-10 text-amber-600" />}
          iconBg="bg-amber-100"
          value={String(stats.certificatesEarned)}
          label="Certificates"
          sub={<span className="text-gray-500">{stats.certificatesToUnlock} more to unlock</span>}
        />
        <Card
          icon={<Flame className="w-10 h-10 text-orange-600" />}
          iconBg="bg-orange-100"
          value={`${stats.currentStreak} days`}
          label="Current Streak"
          sub={<span className="text-gray-500">Longest: {stats.longestStreak} days</span>}
        />
      </div>
    </div>
  )
}

function Card({
  icon,
  iconBg,
  value,
  label,
  sub,
  bottom,
}: {
  icon: React.ReactNode
  iconBg: string
  value: string
  label: string
  sub?: React.ReactNode
  bottom?: React.ReactNode
}) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className={`w-fit ${iconBg} p-3 rounded-xl mb-4`}>{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      {sub && <div className="text-xs">{sub}</div>}
      {bottom && <div className="mt-3">{bottom}</div>}
    </div>
  )
}
