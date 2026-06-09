import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import type { Course } from '@/shared/types'
import CourseCategoryTabs from '../components/CourseCategoryTabs'
import CourseFilter from '../components/CourseFilter'
import CourseGrid from '../components/CourseGrid'

const allCourses: Course[] = [
  {
    id: '1', slug: 'complete-web-development-bootcamp',
    title: 'Complete Web Development Bootcamp 2024',
    description: '',
    instructor: 'Sarah Martinez',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=300&fit=crop',
    price: 299000, originalPrice: 499000, discount: 40,
    rating: 4.8, totalStudents: 12450, duration: 32,
    level: 'Beginner', category: 'Web Development',
    tags: [], isBestseller: true, isFree: false,
    isPublished: true, createdAt: '2024-01-15',
  },
  {
    id: '2', slug: 'react-native-mobile-apps',
    title: 'React Native: Build Mobile Apps dari Nol',
    description: '',
    instructor: 'Ahmad Rizky',
    instructorAvatar: 'https://i.pravatar.cc/150?img=8',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop',
    price: 399000, originalPrice: 599000, discount: 33,
    rating: 4.7, totalStudents: 8920, duration: 24,
    level: 'Intermediate', category: 'Mobile Development',
    tags: [], isBestseller: true, isFree: false,
    isPublished: true, createdAt: '2024-02-01',
  },
  {
    id: '3', slug: 'data-science-python',
    title: 'Data Science with Python - Pemula hingga Expert',
    description: '',
    instructor: 'Dr. Linda Chen',
    instructorAvatar: 'https://i.pravatar.cc/150?img=9',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop',
    price: 449000, originalPrice: 699000, discount: 36,
    rating: 4.9, totalStudents: 15680, duration: 40,
    level: 'Beginner', category: 'Data Science',
    tags: [], isBestseller: true, isFree: false,
    isPublished: true, createdAt: '2024-03-01',
  },
  {
    id: '4', slug: 'nodejs-backend-mastery',
    title: 'Node.js & Express: Backend Development Mastery',
    description: '',
    instructor: 'David Wong',
    instructorAvatar: 'https://i.pravatar.cc/150?img=7',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop',
    price: 349000, originalPrice: undefined, discount: undefined,
    rating: 4.6, totalStudents: 9340, duration: 28,
    level: 'Intermediate', category: 'Backend Development',
    tags: [], isBestseller: false, isFree: false,
    isPublished: true, createdAt: '2024-04-01',
  },
  {
    id: '5', slug: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner - Gratis',
    description: '',
    instructor: 'Michael Johnson',
    instructorAvatar: 'https://i.pravatar.cc/150?img=3',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop',
    price: 0, originalPrice: undefined, discount: undefined,
    rating: 4.5, totalStudents: 18750, duration: 15,
    level: 'Beginner', category: 'Cloud Computing',
    tags: [], isBestseller: false, isFree: true,
    isPublished: true, createdAt: '2024-05-01',
  },
  {
    id: '6', slug: 'devops-docker-kubernetes',
    title: 'DevOps Engineering: CI/CD Pipeline dengan Jenkins',
    description: '',
    instructor: 'Ahmad Rizky',
    instructorAvatar: 'https://i.pravatar.cc/150?img=8',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop',
    price: 499000, originalPrice: undefined, discount: undefined,
    rating: 4.7, totalStudents: 5420, duration: 22,
    level: 'Advanced', category: 'DevOps',
    tags: [], isBestseller: false, isFree: false,
    isPublished: true, createdAt: '2024-06-01',
  },
  {
    id: '7', slug: 'fullstack-javascript',
    title: 'Fullstack JavaScript Developer Path',
    description: '',
    instructor: 'Sarah Martinez',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=300&fit=crop',
    price: 599000, originalPrice: 999000, discount: 40,
    rating: 4.8, totalStudents: 11230, duration: 50,
    level: 'Intermediate', category: 'Web Development',
    tags: [], isBestseller: false, isFree: false,
    isPublished: true, createdAt: '2024-07-01',
  },
  {
    id: '8', slug: 'python-absolute-beginners',
    title: 'Python for Absolute Beginners',
    description: '',
    instructor: 'Dr. Linda Chen',
    instructorAvatar: 'https://i.pravatar.cc/150?img=9',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=300&fit=crop',
    price: 0, originalPrice: undefined, discount: undefined,
    rating: 4.6, totalStudents: 22450, duration: 12,
    level: 'Beginner', category: 'Backend Development',
    tags: [], isBestseller: false, isFree: true,
    isPublished: true, createdAt: '2024-08-01',
  },
  {
    id: '9', slug: 'modern-javascript',
    title: 'Modern JavaScript: ES6+ & Beyond',
    description: '',
    instructor: 'David Wong',
    instructorAvatar: 'https://i.pravatar.cc/150?img=7',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=300&fit=crop',
    price: 249000, originalPrice: 399000, discount: 38,
    rating: 4.7, totalStudents: 14560, duration: 18,
    level: 'Intermediate', category: 'Web Development',
    tags: [], isBestseller: false, isFree: false,
    isPublished: true, createdAt: '2024-09-01',
  },
]

const defaultFilters = {
  levels: [] as string[],
  price: 'all',
  durations: [] as string[],
  ratings: [] as string[],
  features: [] as string[],
}

export default function CourseCatalogPage() {
  const [bannerVisible, setBannerVisible] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua Course')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Terpopuler')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState(defaultFilters)
  const [visibleCount, setVisibleCount] = useState(6)

  const filtered = useMemo(() => {
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
  }, [activeCategory, searchQuery, sortBy, filters])

  const visibleCourses = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, filtered.length))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Promo */}
      {bannerVisible && (
        <div className="bg-indigo-600 text-white py-3 px-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <span className="text-sm font-medium">
              🎉 Free Trial 7 Hari untuk Course Premium
            </span>
            <div className="flex items-center gap-3">
              <button className="bg-white text-indigo-600 rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors">
                Mulai Sekarang
              </button>
              <button
                onClick={() => setBannerVisible(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white py-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Katalog Course</h1>
          <p className="text-gray-500 mt-2">
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
          <div className="mt-6 flex justify-center gap-8 text-sm text-gray-500">
            <span>150+ Courses Available</span>
            <span>·</span>
            <span>10,000+ Students Enrolled</span>
            <span>·</span>
            <span>95% Completion Rate</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CourseCategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
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
          />
        </div>
      </div>
    </div>
  )
}
