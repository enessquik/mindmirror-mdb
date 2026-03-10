'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FiUsers, FiShield, FiTrash2, FiCheck, FiSearch } from 'react-icons/fi';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  favorites: any[];
  watchlist: any[];
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-center py-12">Loading users...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage all registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <FiUsers className="text-4xl text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <FiShield className="text-4xl text-primary" />
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <FiCheck className="text-4xl text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Regular Users</p>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-darkGray border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="pb-3 text-gray-400 font-semibold">User</th>
                <th className="pb-3 text-gray-400 font-semibold">Email</th>
                <th className="pb-3 text-gray-400 font-semibold">Role</th>
                <th className="pb-3 text-gray-400 font-semibold">Favorites</th>
                <th className="pb-3 text-gray-400 font-semibold">Watchlist</th>
                <th className="pb-3 text-gray-400 font-semibold">Joined</th>
                <th className="pb-3 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-400">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-red-900 text-red-300' 
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{user.favorites?.length || 0}</td>
                  <td className="py-4 text-gray-400">{user.watchlist?.length || 0}</td>
                  <td className="py-4 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleRole(user._id, user.role)}
                        className={`p-2 rounded text-white transition ${
                          user.role === 'admin'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      >
                        <FiShield />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
