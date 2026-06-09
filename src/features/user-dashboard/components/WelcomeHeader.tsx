import { useNavigate } from 'react-router'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Flame, PlayCircle, Compass } from 'lucide-react'

interface Props {
  completionPercent: number
  streak: number
}

export default function WelcomeHeader({ completionPercent, streak }: Props) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-lg text-indigo-100 mb-4">
              You've completed {completionPercent}% of your learning journey this month. Keep going!
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Flame className="text-orange-400" size={20} />
              <span className="text-sm font-medium">{streak} Day Streak!</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 bg-white text-indigo-600 font-medium h-12 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <PlayCircle size={20} />
              Continue Learning
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 border-2 border-white text-white font-medium h-12 px-6 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              <Compass size={20} />
              Find New Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
