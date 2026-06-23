import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AdminActivity } from '@/shared/types'

const activityIcons: Record<string, string> = {
  enrollment: 'bg-blue-100 text-blue-600',
  purchase: 'bg-green-100 text-green-600',
  registration: 'bg-purple-100 text-purple-600',
  completion: 'bg-amber-100 text-amber-600',
  review: 'bg-pink-100 text-pink-600',
}

interface Props {
  data: AdminActivity[]
}

export default function EnhancedActivityFeed({ data }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (data.length === 0) return null

  const displayData = expanded ? data : data.slice(0, 4)
  const hasMore = data.length > 4

  return (
    <div className="bg-white rounded-xl border border-black/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
          <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-black/5">
        <AnimatePresence initial={false}>
          {displayData.map((a, i) => (
            <motion.div
              key={`${a.avatar}-${i}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 py-2.5"
            >
              <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 ${activityIcons[a.type] || 'bg-gray-100 text-gray-600'}`}>
                {a.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{a.user}</span> {a.action}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Show {data.length - 4} More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      )}
    </div>
  )
}
