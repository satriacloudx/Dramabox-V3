'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Drama } from '@/types';
import DramaSection from '@/components/DramaSection';
import DramaCard from '@/components/DramaCard';
import { DramaSectionSkeleton } from '@/components/Skeleton';
import { Sparkles, TrendingUp, Clock, Play, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [forYou, setForYou] = useState<Drama[]>([]);
  const [newDramas, setNewDramas] = useState<Drama[]>([]);
  const [popular, setPopular] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forYouRes, newRes, popularRes]: any[] = await Promise.all([
          api.getForYou(1),
          api.getNew(1, 12),
          api.getRank(1),
        ]);
        setForYou(forYouRes?.data?.list || forYouRes?.data || forYouRes || []);
        setNewDramas(newRes?.data?.list || newRes?.data || newRes || []);
        setPopular(popularRes?.data?.list || popularRes?.data || popularRes || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="aspect-[21/9] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse mb-12" />
        <DramaSectionSkeleton />
        <DramaSectionSkeleton />
        <DramaSectionSkeleton />
      </div>
    );
  }

  const featured = forYou[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {featured && <DramaCard drama={featured} variant="hero" />}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Drama Tersedia', value: '1000+', color: 'from-rose-500 to-pink-500' },
            { label: 'Episode Baru', value: '50+', color: 'from-purple-500 to-indigo-500' },
            { label: 'Pengguna Aktif', value: '100K+', color: 'from-blue-500 to-cyan-500' },
            { label: 'Rating Tertinggi', value: '4.9', color: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className="relative glass rounded-2xl p-5 text-center">
                <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <DramaSection
          title="Rekomendasi Untukmu"
          subtitle="Pilihan terbaik berdasarkan preferensimu"
          dramas={forYou.slice(1, 13)}
          href="/popular"
          icon="sparkles"
        />

        {/* Featured Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 md:mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Jelajahi Genre Favoritmu</h3>
              <p className="text-white/80 max-w-md">Romance, Action, Thriller, dan masih banyak lagi. Temukan drama yang sesuai dengan seleramu.</p>
            </div>
            <Link href="/genre" className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Jelajahi Sekarang
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <DramaSection
          title="Rilis Terbaru"
          subtitle="Drama yang baru saja tayang"
          dramas={newDramas}
          href="/new"
          icon="clock"
        />

        <DramaSection
          title="Paling Populer"
          subtitle="Drama dengan penonton terbanyak"
          dramas={popular.slice(0, 12)}
          href="/popular"
          icon="trending"
          showRank
        />

        {/* Top 10 Section */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-500">10</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Top 10 Minggu Ini</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Drama terpopuler minggu ini</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popular.slice(0, 10).map((drama, i) => (
              <DramaCard key={drama.bookId || drama.id || i} drama={drama} rank={i + 1} variant="large" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
