'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Loader2, Rewind, FastForward } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onEnded?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function VideoPlayer({ src, poster, title, onEnded, onPrevious, onNext, hasPrevious, hasNext }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers = {
      loadedmetadata: () => setDuration(video.duration),
      timeupdate: () => setCurrentTime(video.currentTime),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => { setIsPlaying(false); onEnded?.(); },
      waiting: () => setIsLoading(true),
      canplay: () => setIsLoading(false),
      progress: () => {
        if (video.buffered.length > 0) {
          setBuffered(video.buffered.end(video.buffered.length - 1));
        }
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => video.addEventListener(event, handler));
    return () => Object.entries(handlers).forEach(([event, handler]) => video.removeEventListener(event, handler));
  }, [onEnded]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration ? (buffered / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative bg-black rounded-2xl overflow-hidden group aspect-video"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video ref={videoRef} src={src} poster={poster} className="w-full h-full object-contain" onClick={togglePlay} playsInline />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-rose-500 animate-spin" />
        </div>
      )}

      {/* Center Play Button */}
      {!isPlaying && !isLoading && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-rose-500/50 hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
        
        {/* Title */}
        {title && (
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6">
            <p className="text-white font-medium text-sm md:text-base drop-shadow-lg">{title}</p>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="relative p-4 md:p-6 space-y-3">
          {/* Progress Bar */}
          <div ref={progressRef} onClick={handleProgressClick} className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress">
            {/* Buffered */}
            <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${bufferedProgress}%` }} />
            {/* Progress */}
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
            {/* Thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
              {/* Previous */}
              {hasPrevious && (
                <button onClick={onPrevious} className="p-2 md:p-2.5 rounded-full hover:bg-white/20 transition-colors">
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
              )}
              
              {/* Rewind */}
              <button onClick={() => skip(-10)} className="p-2 md:p-2.5 rounded-full hover:bg-white/20 transition-colors">
                <Rewind className="w-5 h-5 text-white" />
              </button>
              
              {/* Play/Pause */}
              <button onClick={togglePlay} className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white fill-current ml-0.5" />}
              </button>
              
              {/* Forward */}
              <button onClick={() => skip(10)} className="p-2 md:p-2.5 rounded-full hover:bg-white/20 transition-colors">
                <FastForward className="w-5 h-5 text-white" />
              </button>
              
              {/* Next */}
              {hasNext && (
                <button onClick={onNext} className="p-2 md:p-2.5 rounded-full hover:bg-white/20 transition-colors">
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              )}
              
              {/* Time */}
              <span className="text-white text-sm ml-2 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Volume */}
              <div className="hidden md:flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="p-2.5 rounded-full hover:bg-white/20 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={1} 
                  step={0.1} 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>

              {/* Settings */}
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 rounded-full hover:bg-white/20 transition-colors">
                  <Settings className="w-5 h-5 text-white" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/10 min-w-[140px]">
                    <p className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">Kecepatan</p>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button 
                        key={rate} 
                        onClick={() => changePlaybackRate(rate)}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors ${playbackRate === rate ? 'text-rose-400' : 'text-white'}`}
                      >
                        {rate}x {rate === 1 && '(Normal)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="p-2.5 rounded-full hover:bg-white/20 transition-colors">
                {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
