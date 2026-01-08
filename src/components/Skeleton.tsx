export function DramaCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-poster rounded-xl bg-gray-200 dark:bg-gray-800 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="space-y-2 px-0.5">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3" />
      </div>
    </div>
  );
}

export function DramaSectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-40 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-56 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[140px] md:w-[160px]">
            <DramaCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="relative aspect-video rounded-2xl bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-1 bg-white/20 rounded-full mb-4" />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EpisodeListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 18 }).map((_, i) => <DramaCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
