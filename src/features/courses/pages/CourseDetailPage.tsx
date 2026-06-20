import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Star, Users, Clock, BookOpen } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiah } from '@/shared/utils'
import LevelBadge from '@/shared/components/common/LevelBadge'
import ErrorState from '@/shared/components/common/ErrorState'
import PageSkeleton from '@/shared/components/common/PageSkeleton'
import type { Course } from '@/shared/types'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: course, isLoading, error, refetch } = useAsync<Course | null>(
    () => repos.course.findBySlug(slug || '')
  )

  if (isLoading) return <PageSkeleton />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Konten Tidak Ditemukan</h1>
        <p className="text-sm text-gray-500 max-w-md mb-6">Course dengan URL tersebut tidak tersedia.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <LevelBadge level={course.level} />
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 rounded px-2 py-0.5">{course.category}</span>
              {course.isBestseller && (
                <span className="text-xs bg-amber-500 text-white rounded-full px-2 py-0.5">Bestseller</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{course.title}</h1>

            <p className="text-gray-600 leading-relaxed max-w-prose mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Star className="fill-amber-400 text-amber-400" size={16} />
                <span className="text-gray-900 font-medium">{course.rating}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {course.totalStudents.toLocaleString()} siswa
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {course.duration} jam
              </span>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-black/10 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {course.instructorAvatar && (
                  <img src={course.instructorAvatar} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Instruktur</div>
                <div className="text-sm text-gray-500">{course.instructor}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-black/10 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Kurikulum Course
              </h2>
              <div className="space-y-3">
                {['Introduction', 'Fundamentals', 'Advanced Topics', 'Projects', 'Final Assessment'].map((section, i) => (
                  <div key={section} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-700">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm space-y-4">
              <div className="text-3xl font-bold text-indigo-600">
                {course.isFree ? 'GRATIS' : formatRupiah(course.price)}
              </div>
              {course.originalPrice && !course.isFree && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">{formatRupiah(course.originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-xs rounded px-1.5 py-0.5">-{course.discount}%</span>
                </div>
              )}

              <button
                className="w-full h-11 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                {course.isFree ? 'Mulai Gratis' : 'Beli Sekarang'}
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Level</span>
                  <span className="font-medium text-gray-900">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori</span>
                  <span className="font-medium text-gray-900">{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span className="font-medium text-gray-900">{course.duration} jam</span>
                </div>
                <div className="flex justify-between">
                  <span>Siswa</span>
                  <span className="font-medium text-gray-900">{course.totalStudents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="font-medium text-gray-900">{course.rating}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
