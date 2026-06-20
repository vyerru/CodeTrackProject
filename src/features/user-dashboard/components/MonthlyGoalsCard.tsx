import { Target, CheckCircle, Settings } from 'lucide-react'
import type { Goal } from '@/shared/types'

interface Props {
  goals: Goal[]
}

export default function MonthlyGoalsCard({ goals }: Props) {
  const totalProgress = goals.reduce((acc, g) => acc + g.current / g.target, 0)
  const overallPercent = Math.round((totalProgress / goals.length) * 100)

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target size={20} />
          <h2 className="text-lg font-bold">Monthly Goals</h2>
        </div>
        <button className="hover:bg-white/20 p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
          <Settings size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div className="flex items-center gap-2">
                {goal.current >= goal.target && <CheckCircle size={16} className="text-green-300" />}
                <span>{goal.title}</span>
              </div>
              <span className="font-semibold">
                {goal.current}/{goal.target}
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/20 pt-5 mt-5">
        <div className="flex flex-col items-center">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={Math.PI * 2 * 50}
              strokeDashoffset={Math.PI * 2 * 50 * (1 - overallPercent / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute mt-[30px] text-center">
            <div className="text-2xl font-bold">{overallPercent}%</div>
          </div>
        </div>
        <p className="text-center text-sm text-indigo-200 mt-2">
          {overallPercent >= 80
            ? "Keep going! You're doing great!"
            : 'You can do it!'}
        </p>
      </div>
    </div>
  )
}
