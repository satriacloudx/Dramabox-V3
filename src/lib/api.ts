const API_BASE = 'https://restxdb.onrender.com/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  return res.json();
}

export const api = {
  getForYou: (page = 1) => 
    fetchApi(`/foryou/${page}?lang=in`),
  
  getNew: (page = 1, pageSize = 10) => 
    fetchApi(`/new/${page}?lang=in&pageSize=${pageSize}`),
  
  getRank: (page = 1) => 
    fetchApi(`/rank/${page}?lang=in`),
  
  getClassify: (params: { page?: number; genre?: string; sort?: number }) => 
    fetchApi(`/classify?lang=in&pageNo=${params.page || 1}${params.genre ? `&genre=${params.genre}` : ''}&sort=${params.sort || 1}`),
  
  search: (keyword: string, page = 1) => 
    fetchApi(`/search/${encodeURIComponent(keyword)}/${page}?lang=in`),
  
  getSuggestions: (keyword: string) => 
    fetchApi(`/suggest/${encodeURIComponent(keyword)}?lang=in`),
  
  getChapters: (bookId: string) => 
    fetchApi(`/chapters/${bookId}?lang=in`),
  
  getWatch: (bookId: string, chapterIndex: number) => 
    fetchApi(`/watch/${bookId}/${chapterIndex}?lang=in&source=search_result`),
  
  getWatchPlayer: (bookId: string, chapterIndex: number) => 
    fetchApi(`/watch/player?lang=in`, {
      method: 'POST',
      body: JSON.stringify({ bookId, chapterIndex, lang: 'in' }),
    }),
};
