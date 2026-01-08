import Link from 'next/link';
import { Home, Search, Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none gradient-text opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm">
              <Film className="w-12 h-12 text-rose-500" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan ke tempat lain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" /> Kembali ke Beranda
          </Link>
          <Link 
            href="/search" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5" /> Cari Drama
          </Link>
        </div>
      </div>
    </div>
  );
}
