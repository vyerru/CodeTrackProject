import { useNavigate } from 'react-router'
import { Sparkles, Star } from 'lucide-react'
import { formatRupiah } from '@/shared/utils'
import type { RecommendedCourse } from '@/shared/types'

interface Props {
  courses: RecommendedCourse[]
}

export default function RecommendedCoursesSection({ courses }: Props) {
  const navigate = useNavigate()

  return (
    <section>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Sparkles className="text-indigo-600" size={22} />
            Recommended for You
          </h2>
          <p className="text-sm text-gray-600 mt-1">Based on your interests and learning path</p>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="text-sm text-indigo-600 font-medium hover:underline shrink-0"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <div
            key={i}
            onClick={() => navigate('/courses')}
            className="bg-white border border-black/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
          >
            <div className="relative overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-[140px] object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                {course.category}
              </span>
              <span className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                {course.level}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.instructor}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="fill-amber-400 text-amber-400" size={14} />
                  <span>{course.rating}</span>
                </div>
                <span>{course.students.toLocaleString()} students</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-indigo-600">{formatRupiah(course.price)}</span>
                <button className="text-xs border border-indigo-600 text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                  View Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
