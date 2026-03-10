'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlay, FiInfo } from 'react-icons/fi';

interface Movie {
  _id: string;
  title: string;
  description: string;
  backdrop: string;
  thumbnail?: string;
  year: number;
  rating: number;
}

export default function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedMovie();
  }, []);

  const fetchFeaturedMovie = async () => {
    try {
      // İlk önce featured filmler dene
      let response = await fetch('/api/movies?featured=true');
      let data = await response.json();
      
      // Featured film yoksa, tüm filmlerden birini al
      if (!data.success || !data.data || data.data.length === 0) {
        response = await fetch('/api/movies?category=trending');
        data = await response.json();
      }
      
      if (data.success && data.data && data.data.length > 0) {
        const randomMovie = data.data[Math.floor(Math.random() * data.data.length)];
        setMovie(randomMovie);
      } else {
        // Hiç film yoksa placeholder göster
        setMovie(null);
      }
    } catch (error) {
      console.error('Failed to fetch featured movie:', error);
      setMovie(null);
    }
  };

  if (!movie) {
    return (
      <div className="h-[80vh] bg-gradient-to-b from-dark to-black flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 w-full text-center">
          <h1 className="text-5xl font-bold text-white mb-4">MindMirror'a Hoş Geldiniz</h1>
          <p className="text-xl text-gray-400 mb-8">Premium akış platformunuz</p>
          <button
            onClick={() => window.location.href = '/movies'}
            className="bg-primary hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition"
          >
            Filmlere Göz At
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.thumbnail || 'https://via.placeholder.com/1600x900/111111/666666?text=No+Image'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-green-500 font-semibold">{movie.rating}/10</span>
              <span className="text-gray-300">{movie.year}</span>
            </div>

            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {movie.description}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/watch/${movie._id}`)}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded transition"
              >
                <FiPlay /> Oynat
              </button>
              <button
                onClick={() => router.push(`/movie/${movie._id}`)}
                className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded transition"
              >
                <FiInfo /> Detaylar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
