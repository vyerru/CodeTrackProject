import { Users, MessageSquare, Eye } from 'lucide-react'
import type { ForumTopic } from '@/shared/types'

interface Props {
  topics: ForumTopic[]
}

export default function CommunityCard({ topics }: Props) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Users className="text-indigo-600" size={20} />
          Community Activity
        </h2>
        <button className="text-sm text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">Join Forum</button>
      </div>

      <div className="space-y-1">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{topic.title}</p>
            <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
              <span>{topic.author}</span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                {topic.replies}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {topic.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
