'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Drama } from '@/types';
import DramaCard from '@/components/DramaCard';
import { PageSkeleton, DramaCardSkeleton } from '@/components/Skeleton';
import { Grid3X3, Loader2, Sparkles } from 'lucide-react';

const GENRES = [
  { id: '', name: 'Semua', emoji: '✨' },
  { id: '1357', name: 'Romance', emoji: '💕' },
  { id: '1358', name: 'CEO', emoji: '👔' },
  { id: '1359', name: 'Revenge', emoji: '🔥' },
  { id: '1360', name: 'Werewolf', emoji: '🐺' },
  { id: '1361', name: 'Marriage', emoji: '💒' },
  { id: '1362', name: 'Fantasy', emoji: '🦋' },
  { id: '1363', name: 'Sweet', emoji: '🍬' },
  { id: '1364', name: 'Action', emoji: '⚡' },
  { id: '1365', name: 'Comedy', emoji: '😂' },
  { id: '1366', name: 'Suspense', emoji: '🎭' },
];

const SORTS = [
  { id: 1, name: 'Terbaru' },
  { id: 2, name: 'Terpopuler' },
  { id: 3, name: 'Rating' },
];

function GenreContent() {
  const searchParams = useSearchParams();
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('g') || '');
  const [selectedSort, setSelectedSort] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchDramas = async (pageNum: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      
      const res: any = await api.getClassify({
        page: pageNum,
        genre: selectedGenre || undefined,
        sort: selectedSort,
      });
      
      const list = res?.data?.list || res?.data || res || [];
      if (append) {
        setDramas(prev => [...prev, ...list]);
      } else {
        setDramas(list);
      }
      setHasMore(list.length >= 10);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchDramas(1);
  }, [selectedGenre, selectedSort]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDramas(nextPage, true);
  };

  const currentGenre = GENRES.find(g => g.id === selectedGenre);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Grid3X3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Jelajahi Genre</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Temukan drama berdasarkan genre favoritmu</p>
          </div>
        </div>

        {/* Genre Pills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                }`}
              >
                <span>{genre.emoji}</span>
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-sm text-gray-500 dark:text-gray-400">Urutkan:</span>
          <div className="flex gap-2">
            {SORTS.map(sort => (
              <button
                key={sort.id}
                onClick={() => setSelectedSort(sort.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSort === sort.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {sort.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 18 }).map((_, i) => <DramaCardSkeleton key={i} />)}
          </div>
        ) : dramas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada drama ditemukan</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Coba pilih genre lain</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {dramas.map((drama, i) => (
                <DramaCard key={drama.bookId || drama.id || i} drama={drama} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    {loadingMore ? <><Loader2 className="w-5 h-5 animate-spin" /> Memuat...</> : 'Muat Lebih Banyak'}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <GenreContent />
    </Suspense>
  );
}
