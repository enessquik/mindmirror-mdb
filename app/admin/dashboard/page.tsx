'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiFilm, FiEye, FiTrendingUp, FiClock, FiStar, FiSettings, FiUpload, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

interface Movie {
  _id: string;
  title: string;
  type: string;
  year: number;
  views: number;
  rating: number;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
  totalSeries?: number;
  avgRating?: number;
  todayViews?: number;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [timeRange]);

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
        setRecentUsers(statsData.recentUsers || []);
        setTopMovies(statsData.topMovies || []);
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
        fetchData(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Dashboard Yükleniyor...</div>
      </div>
    );
  }

  const movieCount = movies.filter(m => m.type === 'movie').length;
  const seriesCount = movies.filter(m => m.type === 'series').length;
  const avgRating = movies.length > 0 
    ? (movies.reduce((acc, m) => acc + m.rating, 0) / movies.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Yönetim Paneli</h1>
        <p className="text-gray-400">Akış platformunuzu yönetin</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link href="/admin/movies/add">
          <button className="flex items-center gap-2 bg-primary hover:bg-red-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiPlus /> İçerik Ekle
          </button>
        </Link>
        <Link href="/admin/users">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiUsers /> Kullanıcılar
          </button>
        </Link>
        <Link href="/admin/bulk">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiUpload /> Toplu İçe Aktar
          </button>
        </Link>
        <Link href="/admin/analytics">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiTrendingUp /> Analitik
          </button>
        </Link>
        <Link href="/admin/logs">
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiClock /> Aktivite Logları
          </button>
        </Link>
        <Link href="/admin/settings">
          <button className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg text-white transition font-semibold shadow-lg w-full justify-center">
            <FiSettings /> Ayarlar
          </button>
        </Link>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-darkGray text-gray-400 hover:text-white'
              }`}
            >
              {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold">Total Users</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
              <p className="text-blue-200 text-xs mt-2">Active Members</p>
            </div>
            <FiUsers className="text-5xl text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold">Total Content</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.totalMovies || 0}</p>
              <p className="text-purple-200 text-xs mt-2">{movieCount} Movies • {seriesCount} Series</p>
            </div>
            <FiFilm className="text-5xl text-purple-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold">Total Views</p>
              <p className="text-4xl font-bold text-white mt-2">{(stats?.totalViews || 0).toLocaleString()}</p>
              <p className="text-green-200 text-xs mt-2">All Time</p>
            </div>
            <FiEye className="text-5xl text-green-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-semibold">Average Rating</p>
              <p className="text-4xl font-bold text-white mt-2">{avgRating}</p>
              <p className="text-yellow-200 text-xs mt-2">⭐ Out of 10</p>
            </div>
            <FiStar className="text-5xl text-yellow-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Movies */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-primary text-xl" />
            <h2 className="text-xl font-bold text-white">Top 5 Most Viewed</h2>
          </div>
          <div className="space-y-3">
            {topMovies.slice(0, 5).map((movie, idx) => (
              <div key={movie._id} className="flex items-center gap-3 p-3 bg-dark rounded-lg hover:bg-gray-800 transition">
                <div className="text-2xl font-bold text-primary">#{idx + 1}</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.views.toLocaleString()} views • {movie.rating}/10</p>
                </div>
                <div className="text-xs text-gray-500 capitalize">{movie.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="text-blue-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-3 p-3 bg-dark rounded-lg hover:bg-gray-800 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Table with Advanced Features */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Content</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition text-sm">
              <FiDownload /> Export CSV
            </button>
            <Link href="/admin/movies/add">
              <button className="flex items-center gap-2 bg-primary hover:bg-red-700 px-4 py-2 rounded text-white transition text-sm">
                <FiPlus /> Add New
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search movies..."
            className="flex-1 px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
          />
          <select className="px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none">
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
          <select className="px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none">
            <option value="">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Viewed</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="pb-3 text-gray-400 font-semibold">Title</th>
                <th className="pb-3 text-gray-400 font-semibold">Type</th>
                <th className="pb-3 text-gray-400 font-semibold">Year</th>
                <th className="pb-3 text-gray-400 font-semibold">Views</th>
                <th className="pb-3 text-gray-400 font-semibold">Rating</th>
                <th className="pb-3 text-gray-400 font-semibold">Added</th>
                <th className="pb-3 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 text-white font-medium">{movie.title}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      movie.type === 'movie' 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-purple-900 text-purple-300'
                    }`}>
                      {movie.type}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{movie.year}</td>
                  <td className="py-4 text-gray-400">{movie.views.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="text-yellow-500 font-semibold">{movie.rating}/10</span>
                  </td>
                  <td className="py-4 text-gray-400 text-sm">
                    {new Date(movie.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/movies/${movie._id}`)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
                        title="Delete"
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
            <div className="text-center py-12 text-gray-400">
              <FiFilm className="text-6xl mx-auto mb-4 opacity-30" />
              <p className="text-xl">No content found. Add your first movie!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {movies.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {movies.length} of {movies.length} entries
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-dark hover:bg-gray-700 rounded text-white transition disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded">1</button>
              <button className="px-4 py-2 bg-dark hover:bg-gray-700 rounded text-white transition" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
