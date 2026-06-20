import { Zap, BookOpen, Award, Download, UserPlus, Settings, ChevronRight } from 'lucide-react'

const actions = [
  { icon: BookOpen, label: 'Add to Journal' },
  { icon: Award, label: 'View Certificates' },
  { icon: Download, label: 'Download Progress Report' },
  { icon: UserPlus, label: 'Invite Friends' },
  { icon: Settings, label: 'Settings' },
]

export default function QuickActionsCard() {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
        <Zap className="text-indigo-600" size={20} />
        Quick Actions
      </h2>

      <div className="space-y-3">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">{action.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
