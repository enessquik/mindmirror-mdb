'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiPlay, FiPlus, FiCheck, FiArrowLeft, FiStar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

interface Movie {
  _id: string;
  title: string;
  description: string;
  type: string;
  imdbId?: string;
  tmdbId?: string;
  year: number;
  duration?: string;
  genre: string[];
  category: string[];
  backdrop: string;
  thumbnail: string;
  rating: number;
  views: number;
}

export default function MovieDetailPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (params.id) {
      fetchMovie(params.id as string);
    }
  }, [params.id]);

  const fetchMovie = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();
      
      if (data.success && data.movie) {
        setMovie(data.movie);
      } else {
        console.error('Movie not found');
        setMovie(null);
      }
    } catch (error) {
      console.error('Failed to fetch movie:', error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: movie?._id }),
      });

      if (response.ok) {
        setInWatchlist(!inWatchlist);
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Film bulunamadı</div>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="relative h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdrop || movie.thumbnail || 'https://via.placeholder.com/1600x900/111111/666666?text=No+Image'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-gray-300 mb-8 transition"
            >
              <FiArrowLeft /> Geri dön
            </button>

            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-500" />
                  <span className="text-white font-semibold">{movie.rating}/10</span>
                </div>
                <span className="text-gray-300">{movie.year}</span>
                {movie.duration && (
                  <span className="text-gray-300">{movie.duration}</span>
                )}
                <span className="text-gray-300 capitalize">{movie.type}</span>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                {[...new Set(movie.genre)].map((g, idx) => (
                  <span key={`${g}-${idx}`} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-lg text-gray-300 mb-8">{movie.description}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push(`/watch/${movie._id}`)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded transition"
                >
                  <FiPlay /> Oynat
                </button>
                <button
                  onClick={toggleWatchlist}
                  className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded transition"
                >
                  {inWatchlist ? <FiCheck /> : <FiPlus />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Details</h2>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="text-gray-400">Views:</span> {movie.views.toLocaleString()}
              </div>
              {movie.imdbId && (
                <div>
                  <span className="text-gray-400">IMDB ID:</span> {movie.imdbId}
                </div>
              )}
              {movie.tmdbId && (
                <div>
                  <span className="text-gray-400">TMDB ID:</span> {movie.tmdbId}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
