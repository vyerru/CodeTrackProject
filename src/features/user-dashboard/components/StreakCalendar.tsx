import { Calendar, Flame } from 'lucide-react'
import type { CalendarDay } from '@/shared/types'

const intensityColors = [
  'bg-gray-100',
  'bg-green-200',
  'bg-green-400',
  'bg-green-600',
  'bg-green-800',
]

interface Props {
  days: CalendarDay[]
  currentStreak: string
  longestStreak: string
  totalActiveDays: string
}

export default function StreakCalendar({ days, currentStreak, longestStreak, totalActiveDays }: Props) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-600" size={22} />
          <Flame className="text-orange-500" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Your Learning Streak</h2>
        </div>
        <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {currentStreak} days
        </span>
      </div>

      <div className="grid grid-cols-12 gap-1">
        {days.map((day, i) => {
          const clampedIntensity = Math.min(day.intensity, 4) as 0 | 1 | 2 | 3 | 4
          return (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all ${intensityColors[clampedIntensity]}`}
              title={`Day ${i + 1}: ${day.lessons} lessons, ${day.hours}h`}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-end gap-1 mt-3">
        <span className="text-xs text-gray-600">Less</span>
        {intensityColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span className="text-xs text-gray-600">More</span>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-black/10 pt-5 mt-5">
        <StatBox value={currentStreak} label="Current Streak" className="text-green-600" />
        <StatBox value={longestStreak} label="Longest Streak" className="text-gray-900" />
        <StatBox value={totalActiveDays} label="Total Active Days" className="text-gray-900" />
      </div>
    </div>
  )
}

function StatBox({ value, label, className }: { value: string; label: string; className: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-semibold ${className}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}
