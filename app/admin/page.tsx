'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiFilm, FiEye } from 'react-icons/fi';

interface Movie {
  _id: string;
  title: string;
  type: string;
  year: number;
  views: number;
  rating: number;
}

interface Stats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      
      const [statsRes, moviesRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/movies', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (moviesRes.ok) {
        const moviesData = await moviesRes.json();
        setMovies(moviesData.movies);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/admin/movies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMovies(movies.filter((m) => m._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
            </div>
            <FiUsers className="text-4xl text-primary" />
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Movies</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalMovies || 0}</p>
            </div>
            <FiFilm className="text-4xl text-primary" />
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.totalViews || 0}</p>
            </div>
            <FiEye className="text-4xl text-primary" />
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Movies & Series</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 px-4 py-2 rounded text-white transition"
          >
            <FiPlus /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="pb-3 text-gray-400">Title</th>
                <th className="pb-3 text-gray-400">Type</th>
                <th className="pb-3 text-gray-400">Year</th>
                <th className="pb-3 text-gray-400">Views</th>
                <th className="pb-3 text-gray-400">Rating</th>
                <th className="pb-3 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="border-b border-gray-800">
                  <td className="py-4 text-white">{movie.title}</td>
                  <td className="py-4 text-gray-400 capitalize">{movie.type}</td>
                  <td className="py-4 text-gray-400">{movie.year}</td>
                  <td className="py-4 text-gray-400">{movie.views}</td>
                  <td className="py-4 text-gray-400">{movie.rating}/10</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/movies/${movie._id}`)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {movies.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No movies found. Add your first movie!
            </div>
          )}
        </div>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <AddMovieModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function AddMovieModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    imdbId: '',
    tmdbId: '',
    year: new Date().getFullYear(),
    duration: '',
    genre: '',
    category: '',
    thumbnail: '',
    backdrop: '',
    rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          genre: formData.genre.split(',').map((g) => g.trim()),
          category: formData.category.split(',').map((c) => c.trim()),
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-darkGray rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Add New Movie/Series</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">IMDB ID (optional - backup source)</label>
              <input
                type="text"
                value={formData.imdbId}
                onChange={(e) => setFormData({ ...formData, imdbId: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="tt1234567"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">TMDB ID ⭐ REQUIRED for Videasy.net</label>
              <input
                type="text"
                value={formData.tmdbId}
                onChange={(e) => setFormData({ ...formData, tmdbId: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="12345"
                required
              />
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded p-3 text-sm text-blue-300">
            <strong>💡 Video Source Info:</strong> TMDB ID is required for Videasy.net player (primary source with auto-play, episode selector, Netflix overlay). Find TMDB IDs at themoviedb.org
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="2h 30m"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Genre (comma separated)</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              placeholder="Action, Adventure, Sci-Fi"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Category (comma separated)</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              placeholder="trending, action, drama"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Backdrop URL</label>
            <input
              type="url"
              value={formData.backdrop}
              onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-red-700 text-white py-2 rounded transition"
            >
              Add Movie
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
