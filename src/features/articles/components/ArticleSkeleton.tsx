import Skeleton from '@/shared/components/ui/Skeleton'

export default function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header skeleton */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 space-y-3">
            <Skeleton className="h-9 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <Skeleton className="h-12 max-w-[600px] mx-auto rounded-xl" />
        </div>
      </section>

      {/* Category filter skeleton */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <div className="flex-1">
              <Skeleton className="w-full aspect-video rounded-xl mb-6" />
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <Skeleton className="w-full aspect-video" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block w-[30%] space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <Skeleton className="h-5 w-32" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
