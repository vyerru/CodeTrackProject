import { Trophy, Zap, Flame, Target, Sun } from 'lucide-react'
import type { Badge, NextBadge } from '@/shared/types'

const badgeIcons = [
  <Zap key="zap" size={24} className="text-indigo-600" />,
  <Flame key="flame" size={24} className="text-orange-500" />,
  <Target key="target" size={24} className="text-blue-600" />,
  <Sun key="sun" size={24} className="text-yellow-500" />,
]

interface Props {
  badges: Badge[]
  nextBadge: NextBadge
}

export default function AchievementsCard({ badges, nextBadge }: Props) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Trophy className="text-indigo-600" size={20} />
          Recent Achievements
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">View All</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {badges.map((badge, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>{badgeIcons[i] ?? badgeIcons[0]}</span>
            <span className="text-xs font-medium text-gray-900 mt-1">{badge.name}</span>
            <span className="text-xs text-gray-500">{badge.date}</span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm font-medium text-indigo-900 mb-2">Next Badge: {nextBadge.name}</p>
        <div className="h-2 bg-indigo-200 rounded-full overflow-hidden mb-1">
          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${nextBadge.progress}%` }} />
        </div>
        <p className="text-xs text-indigo-700">{nextBadge.description}</p>
      </div>
    </div>
  )
}
