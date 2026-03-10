'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { FiPlus, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function AddMovie() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    imdbId: '',
    tmdbId: '',
    year: new Date().getFullYear(),
    duration: '',
    genre: [] as string[],
    category: [] as string[],
    thumbnail: '',
    backdrop: '',
    rating: 0,
    featured: false,
    totalSeasons: 1,
    totalEpisodes: 1,
  });

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
    'Western', 'War', 'Family', 'History', 'Music', 'Sport'
  ];

  const categoryOptions = [
    'trending', 'popular', 'new-releases', 'top-rated', 'action', 
    'comedy', 'drama', 'horror', 'sci-fi', 'documentary'
  ];

  const handleGenreChange = (genre: string) => {
    if (formData.genre.includes(genre)) {
      setFormData({
        ...formData,
        genre: formData.genre.filter(g => g !== genre)
      });
    } else {
      setFormData({
        ...formData,
        genre: [...formData.genre, genre]
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    if (formData.category.includes(category)) {
      setFormData({
        ...formData,
        category: formData.category.filter(c => c !== category)
      });
    } else {
      setFormData({
        ...formData,
        category: [...formData.category, category]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Movie added successfully!');
        router.push('/admin');
      } else {
        alert('Failed to add movie');
      }
    } catch (error) {
      alert('Error adding movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Movie/Series</h1>
        <p className="text-gray-400">Add a new title to your streaming platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Duration (e.g., 2h 16m)</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="2h 16m"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Series Info */}
        {formData.type === 'series' && (
          <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Series Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Total Seasons</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalSeasons}
                  onChange={(e) => setFormData({...formData, totalSeasons: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Total Episodes</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalEpisodes}
                  onChange={(e) => setFormData({...formData, totalEpisodes: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* External IDs */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">External IDs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">TMDB ID *</label>
              <input
                type="text"
                required
                value={formData.tmdbId}
                onChange={(e) => setFormData({...formData, tmdbId: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="Required for Videasy.net"
              />
              <p className="text-gray-500 text-sm mt-1">Get from themoviedb.org</p>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">IMDB ID</label>
              <input
                type="text"
                value={formData.imdbId}
                onChange={(e) => setFormData({...formData, imdbId: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="tt1234567"
              />
              <p className="text-gray-500 text-sm mt-1">Used as fallback source</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Images</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="https://image.tmdb.org/t/p/w500/..."
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Backdrop URL</label>
              <input
                type="url"
                value={formData.backdrop}
                onChange={(e) => setFormData({...formData, backdrop: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="https://image.tmdb.org/t/p/original/..."
              />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Genres</h2>
          
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded transition ${
                  formData.genre.includes(genre)
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
          
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded transition ${
                  formData.category.includes(category)
                    ? 'bg-primary text-white'
                    : 'bg-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="w-5 h-5 text-primary bg-dark border-gray-700 rounded focus:ring-primary"
            />
            <div>
              <span className="text-white font-semibold">Featured</span>
              <p className="text-gray-400 text-sm">Show in hero section on homepage</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 px-8 py-3 rounded-lg text-white transition font-semibold disabled:opacity-50"
          >
            <FiSave /> {loading ? 'Adding...' : 'Add Movie'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-8 py-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
