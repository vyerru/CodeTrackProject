import Skeleton from '@/shared/components/ui/Skeleton'

export default function CourseCatalogSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white py-8 md:py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-8 w-64 mx-auto rounded" />
          <Skeleton className="h-4 w-96 mx-auto mt-3 rounded" />
          <Skeleton className="h-11 max-w-xl mx-auto mt-6 rounded-lg" />
          <div className="flex justify-center gap-6 mt-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 py-3 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <div className="hidden lg:block w-[280px] flex-shrink-0 space-y-4">
            <Skeleton className="h-5 w-24 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
            <Skeleton className="h-5 w-24 rounded mt-6" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-40 rounded" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                  <Skeleton className="w-full h-40 rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-4 w-16 rounded" />
                      <Skeleton className="h-4 w-16 rounded ml-auto" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-9 w-28 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}