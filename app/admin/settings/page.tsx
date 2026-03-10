'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FiSave, FiRefreshCw, FiDatabase, FiVideo, FiMail, FiGlobe } from 'react-icons/fi';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'MindMirror',
    siteDescription: 'Watch your favorite movies and series online',
    videasyColor: 'E50914',
    enableAutoplay: true,
    enableEpisodeSelector: true,
    enableNetflixOverlay: true,
    maxVideosPerUser: 100,
    requireEmailVerification: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      alert('Settings saved successfully!');
      setSaving(false);
    }, 1000);
  };

  const clearCache = () => {
    if (confirm('Clear all cache? This might affect performance temporarily.')) {
      alert('Cache cleared!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your streaming platform</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiGlobe className="text-blue-500 text-xl" />
            <h2 className="text-xl font-bold text-white">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Video Player Settings */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiVideo className="text-purple-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Video Player Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Videasy Color Theme (Hex without #)</label>
              <input
                type="text"
                value={settings.videasyColor}
                onChange={(e) => setSettings({...settings, videasyColor: e.target.value})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
                placeholder="E50914"
              />
              <div className="mt-2 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-700" 
                  style={{backgroundColor: `#${settings.videasyColor}`}}
                />
                <span className="text-gray-400 text-sm">Preview</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoplay}
                  onChange={(e) => setSettings({...settings, enableAutoplay: e.target.checked})}
                  className="w-5 h-5 text-primary bg-dark border-gray-700 rounded focus:ring-primary"
                />
                <div>
                  <span className="text-white font-medium">Enable Auto-play Next Episode</span>
                  <p className="text-gray-400 text-sm">Automatically play next episode for series</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEpisodeSelector}
                  onChange={(e) => setSettings({...settings, enableEpisodeSelector: e.target.checked})}
                  className="w-5 h-5 text-primary bg-dark border-gray-700 rounded focus:ring-primary"
                />
                <div>
                  <span className="text-white font-medium">Enable Episode Selector</span>
                  <p className="text-gray-400 text-sm">Show built-in episode selector in player</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNetflixOverlay}
                  onChange={(e) => setSettings({...settings, enableNetflixOverlay: e.target.checked})}
                  className="w-5 h-5 text-primary bg-dark border-gray-700 rounded focus:ring-primary"
                />
                <div>
                  <span className="text-white font-medium">Enable Netflix-style Overlay</span>
                  <p className="text-gray-400 text-sm">Show overlay when paused without interaction</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiDatabase className="text-green-500 text-xl" />
            <h2 className="text-xl font-bold text-white">Database & Cache</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={clearCache}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white transition"
            >
              <FiRefreshCw /> Clear Cache
            </button>

            <p className="text-gray-400 text-sm">
              Clear cached data to free up space and improve performance.
            </p>
          </div>
        </div>

        {/* User Settings */}
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FiMail className="text-yellow-500 text-xl" />
            <h2 className="text-xl font-bold text-white">User Settings</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                className="w-5 h-5 text-primary bg-dark border-gray-700 rounded focus:ring-primary"
              />
              <div>
                <span className="text-white font-medium">Require Email Verification</span>
                <p className="text-gray-400 text-sm">Users must verify email before watching</p>
              </div>
            </label>

            <div>
              <label className="block text-gray-400 mb-2">Max Videos Per User</label>
              <input
                type="number"
                value={settings.maxVideosPerUser}
                onChange={(e) => setSettings({...settings, maxVideosPerUser: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 px-8 py-3 rounded-lg text-white transition font-semibold disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
