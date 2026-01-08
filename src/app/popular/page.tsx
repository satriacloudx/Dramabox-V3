'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Drama } from '@/types';
import DramaCard from '@/components/DramaCard';
import { PageSkeleton } from '@/components/Skeleton';
import { TrendingUp, Loader2 } from 'lucide-react';

export default function PopularPage() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchDramas = async (pageNum: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res: any = await api.getRank(pageNum);
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
    fetchDramas(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDramas(nextPage, true);
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Drama Populer</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Drama dengan penonton terbanyak saat ini</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {dramas.map((drama, i) => (
            <DramaCard key={drama.bookId || drama.id || i} drama={drama} rank={i + 1} index={i} />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="group relative px-8 py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="flex items-center gap-2">
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
