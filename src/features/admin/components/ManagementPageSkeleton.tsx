import Skeleton from '@/shared/components/ui/Skeleton'

interface Props {
  statCount?: 4 | 5
}

export default function ManagementPageSkeleton({ statCount = 4 }: Props) {
  const gridClass = statCount === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-5'

  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-40 rounded" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className={`grid ${gridClass} gap-4 mb-6`}>
        {Array.from({ length: statCount }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div>
                <Skeleton className="h-7 w-16 mb-1 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Skeleton className="h-9 w-60 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-border">
          <Skeleton className="h-4 w-full rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/5 rounded" />
                <Skeleton className="h-3 w-2/5 rounded" />
              </div>
              <Skeleton className="h-5 w-20 rounded hidden sm:block" />
              <Skeleton className="h-5 w-16 rounded hidden sm:block" />
              <Skeleton className="h-5 w-24 rounded hidden lg:block" />
              <Skeleton className="h-5 w-20 rounded hidden lg:block" />
              <Skeleton className="h-5 w-16 rounded hidden lg:block" />
              <Skeleton className="h-8 w-24 rounded hidden xl:block" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-48 rounded" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  )
}