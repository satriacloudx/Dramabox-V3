'use client';

import Link from 'next/link';
import { ChevronRight, Sparkles, TrendingUp, Clock, Grid3X3 } from 'lucide-react';
import DramaCard from './DramaCard';
import { Drama } from '@/types';

interface DramaSectionProps {
  title: string;
  subtitle?: string;
  dramas: Drama[];
  href?: string;
  showRank?: boolean;
  icon?: 'sparkles' | 'trending' | 'clock' | 'grid';
  variant?: 'scroll' | 'grid';
}

const icons = {
  sparkles: Sparkles,
  trending: TrendingUp,
  clock: Clock,
  grid: Grid3X3,
};

export default function DramaSection({ title, subtitle, dramas, href, showRank, icon, variant = 'scroll' }: DramaSectionProps) {
  if (!dramas?.length) return null;

  const Icon = icon ? icons[icon] : null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-rose-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-rose-500 hover:text-rose-600 text-sm font-medium group">
            Lihat Semua
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {variant === 'scroll' ? (
        <div className="relative -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {dramas.map((drama, i) => (
              <div key={drama.bookId || drama.id || i} className="flex-shrink-0 w-[140px] md:w-[160px] snap-start">
                <DramaCard drama={drama} rank={showRank ? i + 1 : undefined} index={i} />
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-4 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {dramas.map((drama, i) => (
            <DramaCard key={drama.bookId || drama.id || i} drama={drama} rank={showRank ? i + 1 : undefined} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
