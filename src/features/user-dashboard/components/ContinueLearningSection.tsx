import { useNavigate } from 'react-router'
import { ArrowRight, PlayCircle } from 'lucide-react'
import type { CourseProgress } from '@/shared/types'

interface Props {
  currentCourse: CourseProgress
  inProgressCourses: Array<Omit<CourseProgress, 'instructor' | 'instructorAvatar' | 'currentLesson' | 'hoursLeft'>>
}

export default function ContinueLearningSection({ currentCourse, inProgressCourses }: Props) {
  const navigate = useNavigate()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <ArrowRight className="text-indigo-600" size={22} />
          Continue Where You Left Off
        </h2>
        <button
          onClick={() => navigate('/courses')}
          className="text-sm text-indigo-600 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          View All
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-lg transition-shadow mb-4">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative group shrink-0 w-full sm:max-w-[200px]">
            <img
              src={currentCourse.thumbnail}
              alt={currentCourse.title}
              className="w-full aspect-video max-w-[200px] object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 rounded-lg flex items-center justify-center transition-colors">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{currentCourse.title}</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-medium flex items-center justify-center">
                {currentCourse.instructor?.charAt(0)}
              </div>
              <span className="text-sm text-gray-600">{currentCourse.instructor}</span>
            </div>
            <p className="text-sm text-gray-600">{currentCourse.currentLesson}</p>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-indigo-600 font-semibold">{currentCourse.progress}% completed</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${currentCourse.progress}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-gray-500">~{currentCourse.hoursLeft} hours left</span>
              <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                <PlayCircle size={16} />
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {inProgressCourses.map((course, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-20 aspect-video object-cover rounded"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="text-xs text-gray-500 shrink-0">{course.progress}%</span>
              </div>
            </div>
            <button className="text-xs text-indigo-600 font-medium shrink-0 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
              Continue
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
