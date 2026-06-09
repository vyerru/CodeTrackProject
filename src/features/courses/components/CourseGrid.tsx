import { LayoutGrid, List } from 'lucide-react'
import CourseCard from '@/shared/components/common/CourseCard'
import type { Course } from '@/shared/types'

interface Props {
  courses: Course[]
  totalCount: number
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onLoadMore: () => void
  hasMore: boolean
}

const sortOptions = [
  { value: 'Terpopuler', label: 'Terpopuler' },
  { value: 'Terbaru', label: 'Terbaru' },
  { value: 'Harga Terendah', label: 'Harga Terendah' },
  { value: 'Rating Tertinggi', label: 'Rating Tertinggi' },
]

export default function CourseGrid({
  courses,
  totalCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onLoadMore,
  hasMore,
}: Props) {
  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          Menampilkan {courses.length} dari {totalCount} course
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-black/10 text-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} variant="list" />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            className="border border-indigo-600 text-indigo-600 px-8 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            Load More Courses
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Showing {courses.length} of {totalCount} courses
          </p>
        </div>
      )}
    </div>
  )
}
