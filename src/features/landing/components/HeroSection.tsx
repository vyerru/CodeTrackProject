import { useNavigate } from 'react-router'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Master Coding with{' '}
            <span className="text-primary">Consistency & Community</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Belajar coding dengan sistem produktivitas, tracking progress, dan komunitas yang supportive.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth/register')}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium rounded-lg px-6 py-3 text-sm shadow-[0px_10px_20px_-10px_rgba(79,57,246,0.7)] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              Mulai Gratis 7 Hari
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="border border-primary text-primary font-medium rounded-lg px-6 py-3 text-sm hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              Lihat Course
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            {[
              ['1000+', 'Active Learners'],
              ['95%', 'Completion Rate'],
              ['Industry', 'Recognized'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-sm font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <span className="text-4xl font-bold">&lt;/&gt;</span>
              <div className="text-lg font-semibold mt-2">CodeTrack</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
