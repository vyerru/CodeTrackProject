interface Props {
  active: string
  onChange: (category: string) => void
}

const categories = [
  'Semua Course',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Backend Development',
  'DevOps',
  'Cloud Computing',
  'Design',
]

export default function CourseCategoryTabs({ active, onChange }: Props) {
  return (
    <div className="bg-white border-b border-black/10 sticky top-[72px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative">
          <div
            className="flex gap-1 overflow-x-auto py-3 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  active === cat
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
