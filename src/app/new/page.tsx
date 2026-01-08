'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Drama } from '@/types';
import DramaCard from '@/components/DramaCard';
import { PageSkeleton } from '@/components/Skeleton';
import { Clock, Loader2 } from 'lucide-react';

export default function NewReleasesPage() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchDramas = async (pageNum: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res: any = await api.getNew(pageNum, 18);
      const list = res?.data?.list || res?.data || res || [];
      if (append) {
        setDramas(prev => [...prev, ...list]);
      } else {
        setDramas(list);
      }
      setHasMore(list.length >= 18);
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Rilis Terbaru</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Drama yang baru saja dirilis</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {dramas.map((drama, i) => (
            <DramaCard key={drama.bookId || drama.id || i} drama={drama} index={i} />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
