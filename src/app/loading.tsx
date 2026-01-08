export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
