'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface Series {
  _id: string;
  title: string;
  thumbnail?: string;
  backdrop?: string;
  rating: number;
  year: number;
  type: string;
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await fetch('/api/movies?type=series');
      const data = await response.json();
      
      if (data.success) {
        setSeries(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch series:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-white mb-8">TV Series</h1>

        {loading ? (
          <div className="text-center text-white text-xl py-12">Yükleniyor...</div>
        ) : series.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No TV series available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {series.map((show) => (
              <div
                key={show._id}
                onClick={() => router.push(`/movie/${show._id}`)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-darkGray">
                  <img
                    src={show.thumbnail || show.backdrop || `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(show.title)}`}
                    alt={show.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://via.placeholder.com/300x450/1a1a1a/666666?text=${encodeURIComponent(show.title)}`;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded">
                    <span className="text-yellow-500 text-sm font-semibold">{show.rating}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-white font-semibold line-clamp-2 mb-1">
                    {show.title}
                  </h3>
                  <p className="text-sm text-gray-400">{show.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
