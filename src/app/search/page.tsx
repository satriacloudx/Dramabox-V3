'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Drama } from '@/types';
import DramaCard from '@/components/DramaCard';
import { PageSkeleton, DramaCardSkeleton } from '@/components/Skeleton';
import { Search, Loader2, Film } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchResults = async (pageNum: number, append = false) => {
    if (!query) {
      setDramas([]);
      setLoading(false);
      return;
    }

    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      
      const res: any = await api.search(query, pageNum);
      const list = res?.data?.list || res?.data || res || [];
      
      if (append) {
        setDramas(prev => [...prev, ...list]);
      } else {
        setDramas(list);
      }
      setHasMore(list.length >= 10);
    } catch (error) {
      console.error('Failed to search:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [query]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage, true);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center shadow-lg">
            <Search className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Hasil Pencarian</h1>
            {query && (
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Menampilkan hasil untuk "<span className="text-rose-500 font-medium">{query}</span>"
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {!query ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Masukkan kata kunci untuk mencari drama</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => <DramaCardSkeleton key={i} />)}
          </div>
        ) : dramas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-6">
              <Film className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Tidak ada hasil untuk "{query}"</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Coba kata kunci lain</p>
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
                  className="px-8 py-3.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50"
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

export default function SearchPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
