'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-b from-black to-transparent z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              onClick={() => router.push('/')}
              className="cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="MindMirror"
                width={160}
                height={50}
                className="object-contain"
              />
            </div>
            
            <div className="hidden md:flex gap-6">
              <button onClick={() => router.push('/')} className="text-white hover:text-gray-300 transition">
                Ana Sayfa
              </button>
              <button onClick={() => router.push('/browse')} className="text-white hover:text-gray-300 transition">
                Tüm İçerik
              </button>
              <button onClick={() => router.push('/movies')} className="text-white hover:text-gray-300 transition">
                Filmler
              </button>
              <button onClick={() => router.push('/series')} className="text-white hover:text-gray-300 transition">
                Diziler
              </button>
              {user?.role === 'admin' && (
                <button onClick={() => router.push('/admin')} className="text-primary hover:text-red-400 transition">
                  Yönetim Paneli
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ara..."
                  className="bg-darkGray border border-gray-700 rounded-full px-4 py-2 pl-10 text-white focus:outline-none focus:border-primary w-64"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition"
                >
                  <FiUser />
                  <span className="hidden md:inline">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition"
                >
                  <FiLogOut />
                  <span className="hidden md:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-primary hover:bg-red-700 px-6 py-2 rounded text-white transition"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
