'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiMaximize } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

interface Movie {
  _id: string;
  title: string;
  type: string;
  imdbId?: string;
  tmdbId?: string;
}

export default function WatchPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (params.id) {
      fetchMovie(params.id as string);
    }
  }, [params.id, user]);

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

  const getEmbedUrl = () => {
    if (!movie) return '';

    // Videasy.net - Primary source (uses TMDB IDs)
    if (movie.tmdbId) {
      if (movie.type === 'movie') {
        // Movie: https://player.videasy.net/movie/{tmdbId}
        return `https://player.videasy.net/movie/${movie.tmdbId}?color=E50914&overlay=true`;
      } else if (movie.type === 'series') {
        // TV Show: https://player.videasy.net/tv/{tmdbId}/{season}/{episode}
        return `https://player.videasy.net/tv/${movie.tmdbId}/${season}/${episode}?color=E50914&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true`;
      }
    }
    
    // Fallback: VidSrc.pro (uses IMDB IDs)
    if (movie.imdbId) {
      if (movie.type === 'movie') {
        return `https://vidsrc.pro/embed/movie/${movie.imdbId}`;
      } else if (movie.type === 'series') {
        return `https://vidsrc.pro/embed/tv/${movie.imdbId}/${season}/${episode}`;
      }
    }
    
    // Second fallback: VidSrc.to
    if (movie.tmdbId) {
      if (movie.type === 'movie') {
        return `https://vidsrc.to/embed/movie/${movie.tmdbId}`;
      } else if (movie.type === 'series') {
        return `https://vidsrc.to/embed/tv/${movie.tmdbId}/${season}/${episode}`;
      }
    }

    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Film bulunamadı</div>
          <button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-gray-300 mb-4 transition"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="bg-darkGray rounded-lg overflow-hidden">
          <div className="bg-dark px-4 py-3 flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">
              {movie.title}
              {movie.type === 'series' && ` - S${season} E${episode}`}
            </h1>
            <button
              onClick={() => {
                const iframe = document.querySelector('iframe');
                if (iframe?.requestFullscreen) {
                  iframe.requestFullscreen();
                }
              }}
              className="text-white hover:text-gray-300 transition"
            >
              <FiMaximize size={20} />
            </button>
          </div>

          <div className="relative aspect-video bg-black">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>

          {movie.type === 'series' && (
            <div className="bg-dark px-4 py-4">
              <p className="text-gray-400 text-sm mb-4">
                <strong>💡 İpucu:</strong> Bu oynatıcıda yerleşik bölüm seçici bulunmaktadır. Aşağıdaki veya oynatıcıdaki tuşları kullanarak bölüm seçebilirsiniz.
              </p>
              <div className="flex gap-4 items-center">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Sezon</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(parseInt(e.target.value))}
                    className="bg-darkGray border border-gray-700 rounded px-4 py-2 text-white focus:border-primary focus:outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Sezon {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Bölüm</label>
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(parseInt(e.target.value))}
                    className="bg-darkGray border border-gray-700 rounded px-4 py-2 text-white focus:border-primary focus:outline-none"
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Bölüm {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="bg-darkGray px-4 py-3 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              <strong>Not:</strong> Eğer medya yüklenmiyorsa, bekleyin veya benimle ile iletişime geçin.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-darkGray rounded-lg p-6">
          <h2 className="text-white text-lg font-semibold mb-2">Video Kaynakları Hakkında</h2>
          <div className="text-gray-400 text-sm space-y-2">
            <p>Bu oynatıcı, en iyi yayın deneyimi için birden fazla premium video kaynağı kullanır:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Videasy.net:</strong> Yerleşik bölüm seçici</li>
              <li><strong>VidSrc.pro:</strong> Güvenilir yedek kaynak</li>
              <li><strong>VidSrc.to:</strong> Alternatif yedek kaynak</li>
            </ul>
            <p className="mt-2">
              Eğer medyalar ile ilgili hukuki bir sorunuz varsa, <strong>enesspecter@icloud.com adresine email atın.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
