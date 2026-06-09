import { Clock } from 'lucide-react'
import type { Deadline } from '@/shared/types'

const urgencyBadge: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
}

interface Props {
  deadlines: Deadline[]
}

export default function UpcomingDeadlines({ deadlines }: Props) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Clock className="text-indigo-600" size={20} />
          Upcoming Deadlines
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:underline">View Calendar</button>
      </div>

      <div className="space-y-3">
        {deadlines.map((d, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-900">{d.course}</span>
              <span
                className={`text-xs text-white font-medium px-2 py-0.5 rounded-full ${urgencyBadge[d.urgency]}`}
              >
                Due in {d.dueInDays}d
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${d.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{d.progress}% completed</span>
              <button className="text-xs border border-indigo-600 text-indigo-600 font-medium h-7 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
