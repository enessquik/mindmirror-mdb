'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Movie {
  _id: string;
  title: string;
  thumbnail?: string;
  backdrop?: string;
  rating: number;
  year: number;
  type: string;
}

function SearchContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      searchMovies(query);
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [query]);

  const searchMovies = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data || []);
      }
    } catch (error) {
      console.error('Failed to search movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-white mb-8">
          {query ? `"${query}" için sonuçlar` : 'Arama'}
        </h1>

        {loading ? (
          <div className="text-center text-white text-xl py-12">Yükleniyor...</div>
        ) : !query ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">Aramak istediğiniz bir şey yazın</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">Sonuç bulunamadı</p>
            <p>Farklı anahtar kelimeler ile tekrar deneyin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => router.push(`/movie/${movie._id}`)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-darkGray">
                  <img
                    src={movie.thumbnail || movie.backdrop || `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded">
                    <span className="text-yellow-500 text-sm font-semibold">{movie.rating}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-white font-semibold line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span className="capitalize">{movie.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
