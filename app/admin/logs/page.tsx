'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FiActivity, FiClock, FiUser, FiFilm } from 'react-icons/fi';

interface Activity {
  _id: string;
  type: 'login' | 'watch' | 'add_movie' | 'delete_movie' | 'user_register';
  user?: string;
  description: string;
  timestamp: Date;
}

export default function ActivityLogs() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data - in production, fetch from API
  const mockActivities: Activity[] = [
    {
      _id: '1',
      type: 'login',
      user: 'john@example.com',
      description: 'User logged in',
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      _id: '2',
      type: 'watch',
      user: 'jane@example.com',
      description: 'Started watching "Inception"',
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      _id: '3',
      type: 'add_movie',
      user: 'admin@mindmirror.com',
      description: 'Added new movie "The Matrix"',
      timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
      _id: '4',
      type: 'user_register',
      user: 'newuser@example.com',
      description: 'New user registered',
      timestamp: new Date(Date.now() - 60 * 60000),
    },
    {
      _id: '5',
      type: 'watch',
      user: 'john@example.com',
      description: 'Started watching "Breaking Bad S01E01"',
      timestamp: new Date(Date.now() - 120 * 60000),
    },
    {
      _id: '6',
      type: 'delete_movie',
      user: 'admin@mindmirror.com',
      description: 'Deleted movie "Old Movie"',
      timestamp: new Date(Date.now() - 180 * 60000),
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return <FiUser className="text-blue-400" />;
      case 'watch':
        return <FiFilm className="text-purple-400" />;
      case 'add_movie':
        return <FiActivity className="text-green-400" />;
      case 'delete_movie':
        return <FiActivity className="text-red-400" />;
      case 'user_register':
        return <FiUser className="text-yellow-400" />;
      default:
        return <FiActivity className="text-gray-400" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return 'border-blue-700 bg-blue-900/20';
      case 'watch':
        return 'border-purple-700 bg-purple-900/20';
      case 'add_movie':
        return 'border-green-700 bg-green-900/20';
      case 'delete_movie':
        return 'border-red-700 bg-red-900/20';
      case 'user_register':
        return 'border-yellow-700 bg-yellow-900/20';
      default:
        return 'border-gray-700 bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
        <p className="text-gray-400">Track all activities on your platform</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-darkGray text-gray-400 hover:bg-gray-700'
          }`}
        >
          All Activities
        </button>
        <button
          onClick={() => setFilter('login')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'login'
              ? 'bg-blue-600 text-white'
              : 'bg-darkGray text-gray-400 hover:bg-gray-700'
          }`}
        >
          Logins
        </button>
        <button
          onClick={() => setFilter('watch')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'watch'
              ? 'bg-purple-600 text-white'
              : 'bg-darkGray text-gray-400 hover:bg-gray-700'
          }`}
        >
          Watch Events
        </button>
        <button
          onClick={() => setFilter('add_movie')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'add_movie'
              ? 'bg-green-600 text-white'
              : 'bg-darkGray text-gray-400 hover:bg-gray-700'
          }`}
        >
          Content Added
        </button>
        <button
          onClick={() => setFilter('user_register')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'user_register'
              ? 'bg-yellow-600 text-white'
              : 'bg-darkGray text-gray-400 hover:bg-gray-700'
          }`}
        >
          New Users
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading activities...</p>
        ) : filteredActivities.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No activities found</p>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity._id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${getActivityColor(
                  activity.type
                )} transition hover:scale-[1.01]`}
              >
                <div className="text-2xl mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  {activity.user && (
                    <p className="text-gray-400 text-sm mt-1">{activity.user}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FiClock className="text-gray-500" />
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-darkGray rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Activities</p>
          <p className="text-2xl font-bold text-white">{activities.length}</p>
        </div>
        <div className="bg-darkGray rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Logins Today</p>
          <p className="text-2xl font-bold text-blue-400">
            {activities.filter(a => a.type === 'login').length}
          </p>
        </div>
        <div className="bg-darkGray rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Watch Events</p>
          <p className="text-2xl font-bold text-purple-400">
            {activities.filter(a => a.type === 'watch').length}
          </p>
        </div>
        <div className="bg-darkGray rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">New Users</p>
          <p className="text-2xl font-bold text-yellow-400">
            {activities.filter(a => a.type === 'user_register').length}
          </p>
        </div>
      </div>
    </div>
  );
}
