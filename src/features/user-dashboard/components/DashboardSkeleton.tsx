import Skeleton from '@/shared/components/ui/Skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <div className="h-[72px] bg-white shadow-sm flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Skeleton className="h-8 w-24" />
            <div className="hidden md:flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Welcome header skeleton */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Skeleton className="h-8 w-72 bg-white/20 mb-3" />
          <Skeleton className="h-5 w-96 bg-white/20 mb-4" />
          <Skeleton className="h-8 w-36 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 mb-8">
        <div className="grid grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-black/10 rounded-xl p-5 space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 2-column layout skeleton */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-[65%_35%] gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Continue Learning */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="flex gap-5">
                  <Skeleton className="w-[200px] h-[112px] rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-black/10 rounded-xl p-4">
                    <Skeleton className="w-[60px] h-[34px] rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            <section>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-4 w-14 shrink-0" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-black/10 rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-[140px]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3.5 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Streak Calendar */}
            <section>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="bg-white border border-black/10 rounded-xl p-5">
                <div className="flex gap-6 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center space-y-1">
                      <Skeleton className="h-6 w-10 mx-auto" />
                      <Skeleton className="h-3.5 w-14" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[...Array(70)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-3 rounded-sm" />
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-black/10 rounded-xl p-4">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Monthly Goals */}
            <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 bg-white/20" />
                <Skeleton className="h-7 w-7 rounded-lg bg-white/20" />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-40 bg-white/20" />
                    <Skeleton className="h-3.5 w-10 bg-white/20" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-white/20" />
                </div>
              ))}
              <div className="flex flex-col items-center pt-3">
                <Skeleton className="h-[120px] w-[120px] rounded-full bg-white/20" />
                <Skeleton className="h-4 w-40 bg-white/20 mt-3" />
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <section>
              <Skeleton className="h-6 w-44 mb-4" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white border border-black/10 rounded-xl p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="bg-white border border-black/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-12 rounded-xl" />
                  ))}
                </div>
              </div>
            </section>

            {/* Community */}
            <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-black/10 rounded-xl p-4 space-y-1">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
