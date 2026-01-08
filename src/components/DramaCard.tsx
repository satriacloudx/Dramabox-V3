'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, TrendingUp } from 'lucide-react';
import { Drama } from '@/types';

interface DramaCardProps {
  drama: Drama;
  rank?: number;
  variant?: 'default' | 'large' | 'hero';
  index?: number;
}

export default function DramaCard({ drama, rank, variant = 'default', index = 0 }: DramaCardProps) {
  const id = drama.bookId || drama.id;
  const cover = drama.coverUrl || drama.cover;
  const episodes = drama.chapterCount || drama.episodeCount || drama.episodes;

  if (variant === 'hero') {
    return (
      <Link href={`/drama/${id}`} className="relative block w-full aspect-[21/9] md:aspect-[21/8] rounded-3xl overflow-hidden group">
        <Image src={cover || '/placeholder.jpg'} alt={drama.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold backdrop-blur-sm border border-rose-500/30">
                TRENDING
              </span>
              {episodes && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium backdrop-blur-sm">
                  {episodes} Episode
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {drama.title}
            </h1>
            
            {drama.description && (
              <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 max-w-xl">
                {drama.description}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105">
                <Play className="w-5 h-5 fill-current" />
                Tonton Sekarang
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium backdrop-blur-sm transition-all border border-white/20">
                Detail
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'large') {
    return (
      <Link href={`/drama/${id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glow-card card-hover">
          <Image src={cover || '/placeholder.jpg'} alt={drama.title} fill className="object-cover card-image transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          
          {rank && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-white font-bold text-sm">#{rank}</span>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-white fill-current ml-1" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-semibold text-white text-lg line-clamp-2 mb-2">{drama.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              {episodes && <span>{episodes} Ep</span>}
              {drama.genreName && <span className="text-rose-400">{drama.genreName}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/drama/${id}`} className="group block" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="relative aspect-poster rounded-xl overflow-hidden glow-card card-hover bg-gray-100 dark:bg-gray-800">
        <Image src={cover || '/placeholder.jpg'} alt={drama.title} fill className="object-cover card-image transition-transform duration-500" />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rank Badge */}
        {rank && (
          <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs">{rank}</span>
          </div>
        )}
        
        {/* Episode Badge */}
        {episodes && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white font-medium">
            {episodes} Ep
          </div>
        )}
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-white flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-xl">
            <Play className="w-5 h-5 text-rose-600 fill-current ml-0.5" />
          </div>
        </div>
        
        {/* Bottom Info on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-medium line-clamp-1">{drama.title}</p>
        </div>
      </div>
      
      <div className="mt-3 px-0.5">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-rose-500 transition-colors">
          {drama.title}
        </h3>
        {drama.genreName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{drama.genreName}</p>
        )}
      </div>
    </Link>
  );
}
