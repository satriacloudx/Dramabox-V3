'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, Moon, Sun, Menu, X, Play, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) { setSuggestions([]); return; }
      try {
        const data: any = await api.getSuggestions(searchQuery);
        const items = data?.data || data || [];
        setSuggestions(Array.isArray(items) ? items.slice(0, 6).map((s: any) => s.keyword || s) : []);
      } catch { setSuggestions([]); }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/popular', label: 'Populer' },
    { href: '/new', label: 'Terbaru' },
    { href: '/genre', label: 'Genre' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                <span className="gradient-text">Drama</span>
                <span className="text-gray-900 dark:text-white">Box</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
                  {label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <div className={`flex items-center transition-all duration-300 ${showSuggestions ? 'w-64 md:w-80' : 'w-10 md:w-64'}`}>
                  <button onClick={() => setShowSuggestions(true)} className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <div className="hidden md:flex items-center w-full">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Cari drama favorit..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-white/10 border-0 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-rose-500/50 focus:bg-white dark:focus:bg-white/20 transition-all"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full min-w-[280px] right-0 glass rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-2">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSearch(s)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                            <Search className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-200">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
              )}

              {/* Mobile Menu */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl">
            <div className="p-6 pt-20">
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Cari drama..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <nav className="space-y-1">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-medium">
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
