import Link from 'next/link';
import { Play, Heart, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/50 to-gray-100 dark:via-gray-900/50 dark:to-gray-900" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Drama</span>
                <span className="text-gray-900 dark:text-white">Box</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
              Platform streaming drama terbaik dengan koleksi lengkap drama Korea, China, dan Asia.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors group">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          {[
            { title: 'Jelajahi', links: [['Beranda', '/'], ['Populer', '/popular'], ['Terbaru', '/new'], ['Genre', '/genre']] },
            { title: 'Genre', links: [['Romance', '/genre?g=1357'], ['Action', '/genre?g=1364'], ['Comedy', '/genre?g=1365'], ['Thriller', '/genre?g=1366']] },
            { title: 'Bantuan', links: [['FAQ', '#'], ['Kontak', '#'], ['Privasi', '#'], ['Syarat', '#']] },
          ].map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(([label, href], j) => (
                  <li key={j}>
                    <Link href={href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} DramaBox. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-current" /> in Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
