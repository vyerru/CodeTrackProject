import { useNavigate } from 'react-router'
import { Star, Users, Clock, Heart } from 'lucide-react'
import type { Course } from '@/shared/types'
import { formatRupiah } from '@/shared/utils'
import LevelBadge from './LevelBadge'
import ImageWithFallback from './ImageWithFallback'

interface Props {
  course: Course
  variant?: 'grid' | 'list'
}

export default function CourseCard({ course, variant = 'grid' }: Props) {
  const navigate = useNavigate()

  const priceSection = () => {
    if (course.isFree) {
      return <span className="font-semibold text-green-600 truncate">GRATIS</span>
    }
    if (course.originalPrice && course.discount) {
      return (
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="text-xs text-gray-400 line-through truncate">
            {formatRupiah(course.originalPrice)}
          </span>
          <span className="font-semibold text-indigo-600 truncate">
            {formatRupiah(course.price)}
          </span>
          <span className="bg-red-100 text-red-600 text-xs rounded px-1.5 py-0.5 flex-shrink-0">
            -{course.discount}%
          </span>
        </div>
      )
    }
    return <span className="font-semibold text-indigo-600 truncate">{formatRupiah(course.price)}</span>
  }

  const ctaButton = () => {
    if (course.isFree) {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.slug}`) }}
          className="bg-green-500 text-white text-xs rounded-lg px-3 py-1.5 hover:bg-green-600 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none flex-shrink-0"
        >
          Mulai Gratis
        </button>
      )
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.slug}`) }}
        className="bg-indigo-600 text-white text-xs rounded-lg px-3 py-1.5 hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none flex-shrink-0"
      >
        Lihat Detail
      </button>
    )
  }

  if (variant === 'list') {
    return (
      <div
        onClick={() => navigate(`/courses/${course.slug}`)}
        className="flex gap-3 sm:gap-4 border border-black/10 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all group cursor-pointer"
      >
        <div className="relative w-32 sm:w-48 lg:w-60 aspect-video flex-shrink-0">
          <ImageWithFallback src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute top-2 left-2"><LevelBadge level={course.level} /></div>
        </div>
        <div className="flex-1 py-2 pr-3 sm:py-3 sm:pr-4 flex flex-col justify-between min-w-0">
          <div>
            <span className="text-xs text-indigo-600 font-medium">{course.category}</span>
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mt-1">{course.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {course.instructorAvatar && (
                  <ImageWithFallback src={course.instructorAvatar} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <span className="text-xs text-gray-500 truncate">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1"><Star className="fill-amber-400 text-amber-400" size={14} /><span className="text-gray-900 font-medium">{course.rating}</span></span>
              <span className="flex items-center gap-1"><Users size={14} />{course.totalStudents.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{course.duration} jam</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-black/10">
            {priceSection()}
            {ctaButton()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/courses/${course.slug}`)}
      className="overflow-hidden rounded-xl border border-black/10 bg-white hover:shadow-lg transition-all group cursor-pointer"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <ImageWithFallback
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <LevelBadge level={course.level} />
        </div>
        {course.isBestseller && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
            Bestseller
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation() }}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium">{course.category}</span>
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 mt-1 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {course.instructorAvatar && (
              <ImageWithFallback src={course.instructorAvatar} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="text-xs text-gray-500 truncate">{course.instructor}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
          <span className="flex items-center gap-1">
            <Star className="fill-amber-400 text-amber-400" size={14} />
            <span className="text-gray-900 font-medium">{course.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {course.totalStudents.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {course.duration} jam
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-black/10">
          {priceSection()}
          {ctaButton()}
        </div>
      </div>
    </div>
  )
}
