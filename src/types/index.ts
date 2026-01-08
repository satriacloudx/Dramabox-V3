export interface Drama {
  id: string;
  bookId: string;
  title: string;
  cover: string;
  coverUrl?: string;
  description?: string;
  genre?: string;
  genreName?: string;
  rating?: number;
  views?: number;
  viewCount?: number;
  episodes?: number;
  episodeCount?: number;
  chapterCount?: number;
  status?: string;
  year?: string;
  tags?: string[];
  updateTime?: string;
}

export interface Episode {
  id: string;
  chapterId: string;
  chapterIndex: number;
  title: string;
  name?: string;
  duration?: number;
  thumbnail?: string;
  cover?: string;
  isFree?: boolean;
  unlockType?: number;
}

export interface Genre {
  id: string;
  name: string;
  code?: string;
}

export interface SearchSuggestion {
  keyword: string;
  bookId?: string;
}

export interface VideoSource {
  url: string;
  quality?: string;
  type?: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}
