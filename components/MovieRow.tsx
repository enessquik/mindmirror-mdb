'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Movie {
  _id: string;
  title: string;
  thumbnail?: string;
  backdrop?: string;
  rating: number;
  year: number;
}

interface MovieRowProps {
  title: string;
  category: string;
}

export default function MovieRow({ title, category }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`/api/movies?category=${category}`);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="px-4 md:px-8 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-r opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => router.push(`/movie/${movie._id}`)}
              className="flex-none w-48 cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-darkGray">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-green-500">{movie.rating}/10</span>
                      <span className="text-gray-400">{movie.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-l opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
