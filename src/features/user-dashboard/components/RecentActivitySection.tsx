import { CheckCircle, Award, Star, MessageSquare } from 'lucide-react'
import type { Activity } from '@/shared/types'

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  completed: { icon: <CheckCircle size={16} className="text-green-600" />, bg: 'bg-green-100' },
  certificate: { icon: <Award size={16} className="text-amber-600" />, bg: 'bg-amber-100' },
  quiz: { icon: <Star size={16} className="text-blue-600" />, bg: 'bg-blue-100' },
  forum: { icon: <MessageSquare size={16} className="text-purple-600" />, bg: 'bg-purple-100' },
}

interface Props {
  activities: Activity[]
}

export default function RecentActivitySection({ activities }: Props) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <ActivityIcon />
          Recent Activity
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
      </div>

      <div className="space-y-1">
        {activities.map((item, i) => {
          const meta = iconMap[item.type] ?? iconMap.completed
          const isLast = i === activities.length - 1

          return (
            <div key={i} className="relative flex items-start gap-3 pb-1">
              {!isLast && (
                <div className="absolute left-[15px] top-6 w-0.5 h-6 bg-gray-200" />
              )}
              <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center shrink-0 relative z-10`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <p className="text-sm text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActivityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
