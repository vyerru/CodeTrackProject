import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import type { Course } from '@/shared/types'
import CourseCategoryTabs from '../components/CourseCategoryTabs'
import CourseFilter, { FilterForm } from '../components/CourseFilter'
import CourseGrid from '../components/CourseGrid'
import ErrorState from '@/shared/components/common/ErrorState'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet'

const defaultFilters = {
  levels: [] as string[],
  price: 'all',
  durations: [] as string[],
  ratings: [] as string[],
  features: [] as string[],
}

export default function CourseCatalogPage() {
  const { data: allCourses, isLoading, error, refetch } = useAsync<Course[]>(
    () => repos.course.findAll()
  )

  const [bannerVisible, setBannerVisible] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua Course')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terpopuler')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState(defaultFilters)
  const [visibleCount, setVisibleCount] = useState(6)
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!allCourses) return []
    let result = [...allCourses]

    if (activeCategory !== 'Semua Course') {
      result = result.filter((c) => c.category === activeCategory)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q),
      )
    }

    if (filters.levels.length > 0) {
      result = result.filter((c) => filters.levels.includes(c.level))
    }

    if (filters.price === 'free') {
      result = result.filter((c) => c.isFree)
    } else if (filters.price === 'paid') {
      result = result.filter((c) => !c.isFree)
    }

    if (filters.ratings.length > 0) {
      const maxRating = Math.max(...filters.ratings.map(Number))
      result = result.filter((c) => c.rating >= maxRating)
    }

    switch (sortBy) {
      case 'Terpopuler':
        result.sort((a, b) => b.totalStudents - a.totalStudents)
        break
      case 'Terbaru':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'Harga Terendah':
        result.sort((a, b) => a.price - b.price)
        break
      case 'Rating Tertinggi':
        result.sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [allCourses, activeCategory, searchQuery, sortBy, filters])

  const visibleCourses = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filtered.length))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  if (isLoading) return <LoadingSpinner fullPage />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Promo */}
      {bannerVisible && (
        <div className="bg-indigo-600 text-white py-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="text-xs sm:text-sm font-medium text-center sm:text-left">
              🎉 Free Trial 7 Hari untuk Course Premium
            </span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="bg-white text-indigo-600 rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none">
                Mulai Sekarang
              </button>
              <button
                onClick={() => setBannerVisible(false)}
                className="text-white/80 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white py-8 md:py-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Katalog Course</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">
            Pilih course yang sesuai dengan tujuan karir dan level skill kamu
          </p>

          {/* Search */}
          <div className="mt-6 max-w-xl mx-auto relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari course berdasarkan judul, skill, atau topik..."
              className="pl-10 h-11 rounded-lg border border-black/10 bg-white w-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs sm:text-sm text-gray-500">
            <span>150+ Courses</span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span>10,000+ Students</span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span>95% Completion</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CourseCategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="overflow-y-auto w-[85vw] max-w-sm">
          <SheetHeader className="mb-4">
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <FilterForm filters={filters} onChange={setFilters} onReset={resetFilters} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <CourseFilter filters={filters} onChange={setFilters} onReset={resetFilters} />
          <CourseGrid
            courses={visibleCourses}
            totalCount={filtered.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            onFilterClick={() => setFilterOpen(true)}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  )
}
