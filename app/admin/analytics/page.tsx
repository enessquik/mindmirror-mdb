'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  FiTrendingUp, FiUsers, FiEye, FiStar, FiCalendar, 
  FiActivity, FiClock, FiBarChart2 
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  viewsOverTime: Array<{ date: string; views: number }>;
  topGenres: Array<{ name: string; count: number }>;
  userGrowth: Array<{ date: string; users: number }>;
  watchTime: Array<{ hour: string; watches: number }>;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  // Mock data - in production, fetch from API
  const viewsOverTime = [
    { date: 'Mon', views: 120 },
    { date: 'Tue', views: 180 },
    { date: 'Wed', views: 150 },
    { date: 'Thu', views: 220 },
    { date: 'Fri', views: 280 },
    { date: 'Sat', views: 350 },
    { date: 'Sun', views: 310 },
  ];

  const genresData = [
    { name: 'Action', value: 35 },
    { name: 'Drama', value: 25 },
    { name: 'Comedy', value: 20 },
    { name: 'Sci-Fi', value: 15 },
    { name: 'Horror', value: 5 },
  ];

  const userGrowthData = [
    { date: 'Week 1', users: 50 },
    { date: 'Week 2', users: 85 },
    { date: 'Week 3', users: 120 },
    { date: 'Week 4', users: 165 },
  ];

  const peakHoursData = [
    { hour: '00:00', watches: 15 },
    { hour: '04:00', watches: 8 },
    { hour: '08:00', watches: 25 },
    { hour: '12:00', watches: 45 },
    { hour: '16:00', watches: 65 },
    { hour: '20:00', watches: 120 },
    { hour: '23:00', watches: 85 },
  ];

  const COLORS = ['#E50914', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Track your platform performance and insights</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-4 py-2 bg-darkGray border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Views</p>
              <p className="text-3xl font-bold text-white">1,610</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <FiTrendingUp /> +12.5%
              </p>
            </div>
            <FiEye className="text-5xl text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Avg. Rating</p>
              <p className="text-3xl font-bold text-white">8.2</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <FiTrendingUp /> +0.3
              </p>
            </div>
            <FiStar className="text-5xl text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm mb-1">Active Users</p>
              <p className="text-3xl font-bold text-white">165</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <FiTrendingUp /> +8.2%
              </p>
            </div>
            <FiUsers className="text-5xl text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm mb-1">Avg. Watch Time</p>
              <p className="text-3xl font-bold text-white">42m</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <FiTrendingUp /> +5.1%
              </p>
            </div>
            <FiClock className="text-5xl text-orange-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Over Time */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-blue-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Views Over Time</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#E50914" 
                strokeWidth={2}
                dot={{ fill: '#E50914', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="text-purple-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Popular Genres</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiUsers className="text-green-500 text-xl" />
            <h2 className="text-xl font-bold text-white">User Growth</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="users" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="text-orange-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Peak Viewing Hours</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="watches" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Content Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completion Rate</span>
              <span className="text-white font-semibold">68%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Return Rate</span>
              <span className="text-white font-semibold">72%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Uptime</span>
              <span className="text-white font-semibold">99.8%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
