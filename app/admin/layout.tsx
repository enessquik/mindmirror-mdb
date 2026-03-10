'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, isLoading, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-darkGray border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Welcome, {user.name}</span>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-primary hover:bg-red-700 rounded text-white transition"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
