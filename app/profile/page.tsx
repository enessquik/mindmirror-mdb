'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { FiHeart, FiClock } from 'react-icons/fi';

interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  rating: number;
  year: number;
  type: string;
}

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist'>('favorites');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get('token');

      const [favoritesRes, watchlistRes] = await Promise.all([
        fetch('/api/user/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/user/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (favoritesRes.ok) {
        const data = await favoritesRes.json();
        setFavorites(data.favorites || []);
      }

      if (watchlistRes.ok) {
        const data = await watchlistRes.json();
        setWatchlist(data.watchlist || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const currentList = activeTab === 'favorites' ? favorites : watchlist;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">{user.name} • {user.email}</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition ${
              activeTab === 'favorites'
                ? 'text-white border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiHeart /> Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition ${
              activeTab === 'watchlist'
                ? 'text-white border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiClock /> Watchlist ({watchlist.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading...</div>
        ) : currentList.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">
              No {activeTab === 'favorites' ? 'favorites' : 'watchlist items'} yet
            </p>
            <p>Start adding movies and series you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentList.map((movie) => (
              <div
                key={movie._id}
                onClick={() => router.push(`/movie/${movie._id}`)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-darkGray">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
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
