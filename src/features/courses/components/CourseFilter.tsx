import { Star } from 'lucide-react'

interface FilterState {
  levels: string[]
  price: string
  durations: string[]
  ratings: string[]
  features: string[]
}

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
}

const levelOptions = [
  { value: 'Beginner', label: 'Beginner', count: 45 },
  { value: 'Intermediate', label: 'Intermediate', count: 68 },
  { value: 'Advanced', label: 'Advanced', count: 37 },
]

const priceOptions = [
  { value: 'all', label: 'Semua Harga' },
  { value: 'free', label: 'Gratis' },
  { value: 'paid', label: 'Berbayar' },
]

const durationOptions = [
  { value: '<5', label: '< 5 jam' },
  { value: '5-10', label: '5-10 jam' },
  { value: '10-20', label: '10-20 jam' },
  { value: '20+', label: '20+ jam' },
]

const ratingOptions = [
  { value: '4.5', label: '4.5+', stars: 5 },
  { value: '4', label: '4+', stars: 4 },
  { value: '3.5', label: '3.5+', stars: 3 },
  { value: '3', label: '3+', stars: 3 },
]

const featureOptions = [
  { value: 'certificate', label: 'Sertifikat' },
  { value: 'challenges', label: 'Coding Challenges' },
  { value: 'github', label: 'GitHub Integration' },
  { value: 'forum', label: 'Forum Diskusi' },
]

export default function CourseFilter({ filters, onChange, onReset }: Props) {
  const toggleLevel = (value: string) => {
    const next = filters.levels.includes(value)
      ? filters.levels.filter((v) => v !== value)
      : [...filters.levels, value]
    onChange({ ...filters, levels: next })
  }

  const setPrice = (value: string) => {
    onChange({ ...filters, price: value })
  }

  const toggleDuration = (value: string) => {
    const next = filters.durations.includes(value)
      ? filters.durations.filter((v) => v !== value)
      : [...filters.durations, value]
    onChange({ ...filters, durations: next })
  }

  const toggleRating = (value: string) => {
    const next = filters.ratings.includes(value)
      ? filters.ratings.filter((v) => v !== value)
      : [...filters.ratings, value]
    onChange({ ...filters, ratings: next })
  }

  const toggleFeature = (value: string) => {
    const next = filters.features.includes(value)
      ? filters.features.filter((v) => v !== value)
      : [...filters.features, value]
    onChange({ ...filters, features: next })
  }

  const renderStars = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <Star key={i} className="fill-amber-400 text-amber-400" size={14} />
    ))

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-36">
        <h3 className="font-semibold text-gray-900 mb-4">Filter</h3>

        {/* Level */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Level</h4>
          <div className="space-y-2">
            {levelOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.levels.includes(opt.value)}
                  onChange={() => toggleLevel(opt.value)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{opt.label}</span>
                <span className="text-gray-400">({opt.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Harga */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Harga</h4>
          <div className="space-y-2">
            {priceOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={filters.price === opt.value}
                  onChange={() => setPrice(opt.value)}
                  className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Durasi */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Durasi</h4>
          <div className="space-y-2">
            {durationOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.durations.includes(opt.value)}
                  onChange={() => toggleDuration(opt.value)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
          <div className="space-y-2">
            {ratingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleRating(opt.value)}
                className={`flex items-center gap-2 text-sm w-full text-left py-1 px-2 rounded transition-colors ${
                  filters.ratings.includes(opt.value) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-0.5">{renderStars(opt.stars)}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fitur */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fitur</h4>
          <div className="space-y-2">
            {featureOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.features.includes(opt.value)}
                  onChange={() => toggleFeature(opt.value)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => onChange(filters)}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Terapkan Filter
        </button>
        <button
          onClick={onReset}
          className="w-full text-gray-500 text-sm text-center mt-2 hover:text-gray-700 transition-colors"
        >
          Reset Semua
        </button>
      </div>
    </aside>
  )
}
