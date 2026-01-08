'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Drama, Episode } from '@/types';
import { Play, Eye, ChevronDown, ChevronUp, Share2, Heart, List, Clock, Sparkles } from 'lucide-react';
import { VideoPlayerSkeleton, EpisodeListSkeleton } from '@/components/Skeleton';
import VideoPlayer from '@/components/VideoPlayer';

export default function DramaDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchDrama = async () => {
      try {
        const res: any = await api.getChapters(bookId);
        const data = res?.data || res;
        
        if (data?.book || data?.bookInfo) {
          setDrama(data.book || data.bookInfo);
        }
        
        const chapterList = data?.chapters || data?.chapterList || data?.list || [];
        setEpisodes(chapterList.map((ep: any, idx: number) => ({
          ...ep,
          chapterIndex: ep.chapterIndex ?? idx,
        })));
      } catch (error) {
        console.error('Failed to fetch drama:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrama();
  }, [bookId]);

  const playEpisode = async (index: number) => {
    setLoadingVideo(true);
    setCurrentEpisode(index);
    
    try {
      const res: any = await api.getWatch(bookId, index);
      const url = res?.data?.playUrl || res?.data?.url || res?.playUrl || res?.url;
      setVideoUrl(url || '');
    } catch (error) {
      console.error('Failed to get video:', error);
      try {
        const res: any = await api.getWatchPlayer(bookId, index);
        const url = res?.data?.playUrl || res?.data?.url || res?.playUrl || res?.url;
        setVideoUrl(url || '');
      } catch (e) {
        console.error('Fallback also failed:', e);
      }
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: drama?.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoPlayerSkeleton />
            </div>
            <div>
              <EpisodeListSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayedEpisodes = showAllEpisodes ? episodes : episodes.slice(0, 20);
  const cover = drama?.coverUrl || drama?.cover;
  const totalEpisodes = drama?.chapterCount || drama?.episodeCount || episodes.length;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {videoUrl ? (
              <VideoPlayer
                src={videoUrl}
                poster={cover}
                title={`Episode ${currentEpisode + 1}: ${episodes[currentEpisode]?.title || episodes[currentEpisode]?.name || ''}`}
                onEnded={() => currentEpisode < episodes.length - 1 && playEpisode(currentEpisode + 1)}
                onPrevious={() => playEpisode(currentEpisode - 1)}
                onNext={() => playEpisode(currentEpisode + 1)}
                hasPrevious={currentEpisode > 0}
                hasNext={currentEpisode < episodes.length - 1}
              />
            ) : (
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                {cover && <Image src={cover} alt={drama?.title || ''} fill className="object-cover opacity-40 blur-sm" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {loadingVideo ? (
                    <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-rose-500 animate-spin" />
                  ) : (
                    <>
                      <button onClick={() => playEpisode(0)} className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-rose-500/50 hover:scale-110 transition-transform mb-4">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </button>
                      <p className="text-white font-medium">Mulai Menonton</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Drama Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {drama?.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {totalEpisodes && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-sm font-medium">
                    <List className="w-4 h-4" /> {totalEpisodes} Episode
                  </span>
                )}
                {drama?.viewCount && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-sm">
                    <Eye className="w-4 h-4" /> {formatViews(drama.viewCount)}
                  </span>
                )}
                {drama?.genreName && (
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
                    {drama.genreName}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    isLiked 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30' 
                      : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Disukai' : 'Suka'}
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 font-medium transition-colors">
                  <Share2 className="w-5 h-5" /> Bagikan
                </button>
              </div>

              {/* Description */}
              {drama?.description && (
                <div className="glass rounded-2xl p-5">
                  <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${!showDescription ? 'line-clamp-3' : ''}`}>
                    {drama.description}
                  </p>
                  {drama.description.length > 200 && (
                    <button onClick={() => setShowDescription(!showDescription)} className="text-rose-500 text-sm font-medium mt-3 flex items-center gap-1 hover:text-rose-600 transition-colors">
                      {showDescription ? <><ChevronUp className="w-4 h-4" /> Sembunyikan</> : <><ChevronDown className="w-4 h-4" /> Selengkapnya</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Episode List */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Daftar Episode
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10">
                  {episodes.length} Ep
                </span>
              </div>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide pr-1">
                {displayedEpisodes.map((ep, idx) => {
                  const epIndex = ep.chapterIndex ?? idx;
                  const isActive = currentEpisode === epIndex && videoUrl;
                  const isFree = ep.isFree !== false && ep.unlockType !== 1;
                  
                  return (
                    <button
                      key={ep.chapterId || idx}
                      onClick={() => playEpisode(epIndex)}
                      disabled={!isFree}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/30'
                          : isFree
                          ? 'hover:bg-gray-100 dark:hover:bg-white/10'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'
                      }`}>
                        {isActive ? (
                          <div className="flex gap-0.5 items-end h-4">
                            <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                            <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                            <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-150" />
                          </div>
                        ) : (
                          <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {epIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Episode {epIndex + 1}
                        </p>
                        {(ep.title || ep.name) && (
                          <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                            {ep.title || ep.name}
                          </p>
                        )}
                      </div>
                      {!isFree && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs font-medium rounded-full">VIP</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {episodes.length > 20 && (
                <button 
                  onClick={() => setShowAllEpisodes(!showAllEpisodes)} 
                  className="w-full mt-4 py-3 text-center text-rose-500 font-medium text-sm hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  {showAllEpisodes ? (
                    <><ChevronUp className="w-4 h-4" /> Tampilkan Lebih Sedikit</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Tampilkan Semua ({episodes.length})</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatViews(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
