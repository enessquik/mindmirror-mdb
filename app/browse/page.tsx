'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FiGrid, FiList } from 'react-icons/fi';

interface Movie {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail?: string;
  backdrop?: string;
  rating: number;
  year: number;
  genre: string[];
  category: string[];
}

export default function BrowsePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  const itemsPerPage = viewMode === 'grid' ? 20 : 10;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`/api/movies?limit=500`);
        const data = await response.json();
        
        if (data.success) {
          setMovies(data.data);
          
          // Extract unique genres
          const genres = new Set<string>();
          data.data.forEach((movie: Movie) => {
            movie.genre?.forEach(g => genres.add(g));
          });
          setAllGenres(Array.from(genres).sort());
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search, genre, and type
  useEffect(() => {
    let filtered = movies;

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(m => m.genre?.includes(selectedGenre));
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
    setFilteredMovies(filtered);
  }, [searchTerm, selectedGenre, selectedType, movies, itemsPerPage]);

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-6">Tüm İçerik</h1>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-600 outline-none"
            />

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-600 outline-none"
            >
              <option value="all">Tüm Türler</option>
              <option value="movie">Filmler</option>
              <option value="series">Diziler</option>
            </select>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-red-600 outline-none"
            >
              <option value="all">Tüm Türler</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex gap-2 bg-gray-900 rounded border border-gray-700 p-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-1 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
              >
                <FiGrid className="inline mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-1 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
              >
                <FiList className="inline mr-2" />
                Liste
              </button>
            </div>
          </div>

          {/* Results info */}
          <div className="text-gray-400">
            {filteredMovies.length} sonuç bulundu ({currentPage}/{totalPages} sayfa)
          </div>
        </div>

        {/* Movies Grid/List */}
        {paginatedMovies.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {paginatedMovies.map((movie) => (
                  <a key={movie._id} href={`/movie/${movie._id}`} className="group">
                    <div className="relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden mb-2">
                      <img
                        src={movie.thumbnail || movie.backdrop || `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`}
                        alt={movie.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`;
                        }}
                      />
                      
                      {/* Rating overlay */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-yellow-400 text-sm font-bold">
                        ⭐ {movie.rating}
                      </div>

                      {/* Type badge */}
                      <div className="absolute bottom-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          movie.type === 'series' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {movie.type === 'series' ? 'DİZİ' : 'FİLM'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-red-600">
                      {movie.title}
                    </h3>
                    <p className="text-gray-500 text-xs">{movie.year}</p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-2 mb-8">
                {paginatedMovies.map((movie) => (
                  <a key={movie._id} href={`/movie/${movie._id}`} className="block">
                    <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors group flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-24 h-36 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                        <img
                          src={movie.thumbnail || movie.backdrop || `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`}
                          alt={movie.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(movie.title)}`;
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold text-lg group-hover:text-red-600">
                            {movie.title}
                          </h3>
                          <span className="text-yellow-400 font-bold">⭐ {movie.rating}</span>
                        </div>

                        <div className="flex gap-2 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            movie.type === 'series' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {movie.type === 'series' ? 'DİZİ' : 'FİLM'}
                          </span>
                          <span className="text-gray-400 text-sm">{movie.year}</span>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-2">{movie.description}</p>

                        {movie.genre && movie.genre.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {[...new Set(movie.genre.slice(0, 4))].map((g, idx) => (
                              <span key={`${g}-${idx}`} className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
                                {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 py-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
                >
                  Önceki
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + Math.max(1, currentPage - 2);
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Sonuç bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
