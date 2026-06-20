import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote: 'CodeTrack mengubah cara saya belajar programming. Sistem streak dan progress tracking membuat saya tetap konsisten setiap hari. Dalam 3 bulan, saya berhasil transisi karir menjadi frontend developer!',
    name: 'Sarah Martinez',
    role: 'Frontend Developer at Tech Startup',
    avatar: 'SM',
  },
  {
    quote: 'Sistem streak dan tracking progress sangat membantu saya tetap on track. Dulu saya sering berhenti di tengah jalan, tapi dengan CodeTrack saya berhasil menyelesaikan 4 course dalam 6 bulan.',
    name: 'Budi Santoso',
    role: 'Backend Engineer at Startup',
    avatar: 'BS',
  },
  {
    quote: 'Komunitas CodeTrack luar biasa supportive! Forum diskusi dan peer review benar-benar membantu saya memahami konsep yang sulit. Sekarang saya bekerja sebagai full stack developer.',
    name: 'Andi Wijaya',
    role: 'Full Stack Developer',
    avatar: 'AW',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  const t = testimonials[current]

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-[#111827] mb-10">
          Dipercaya oleh Career Switcher & Professionals
        </h2>

        <div className="bg-white border border-black/10 rounded-xl p-8 space-y-4">
          <div className="flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-amber-400 text-amber-400" size={20} />
            ))}
          </div>

          <p className="text-[#495565] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#4f39f6] flex items-center justify-center text-white text-sm font-medium">
              {t.avatar}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-[#111827]">{t.name}</div>
              <div className="text-xs text-[#697282]">{t.role}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <ChevronLeft size={18} className="text-[#495565]" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                  i === current ? 'bg-[#4f39f6]' : 'bg-black/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <ChevronRight size={18} className="text-[#495565]" />
          </button>
        </div>
      </div>
    </section>
  )
}
