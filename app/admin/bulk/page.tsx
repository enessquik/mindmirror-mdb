'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { FiUpload, FiDownload, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkImport() {
  const [jsonData, setJsonData] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const router = useRouter();

  const sampleData = [
    {
      title: "The Matrix",
      description: "A computer hacker learns about the true nature of reality...",
      type: "movie",
      imdbId: "tt0133093",
      tmdbId: "603",
      year: 1999,
      duration: "2h 16m",
      genre: ["Action", "Sci-Fi"],
      category: ["trending", "action"],
      thumbnail: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      rating: 8.7,
      featured: true
    }
  ];

  const handleImport = async () => {
    try {
      setImporting(true);
      setResult(null);

      const movies = JSON.parse(jsonData);
      if (!Array.isArray(movies)) {
        alert('Data must be an array of movies');
        return;
      }

      const token = Cookies.get('token');
      const results: ImportResult = { success: 0, failed: 0, errors: [] };

      for (const movie of movies) {
        try {
          const response = await fetch('/api/admin/movies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(movie),
          });

          if (response.ok) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`Failed to import: ${movie.title}`);
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`Error importing: ${movie.title}`);
        }
      }

      setResult(results);
    } catch (error) {
      alert('Invalid JSON format');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([template], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-template.json';
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk Import</h1>
        <p className="text-gray-400">Import multiple movies/series at once using JSON</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FiAlertCircle className="text-blue-400" />
          How to Use Bulk Import
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-200">
          <li>Download the template file below</li>
          <li>Edit the JSON file with your movies/series data</li>
          <li>Paste the JSON content in the text area</li>
          <li>Click "Import Movies" to start the import process</li>
        </ol>
        <button
          onClick={downloadTemplate}
          className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
        >
          <FiDownload /> Download Template
        </button>
      </div>

      {/* JSON Input */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800 mb-6">
        <label className="block text-white font-semibold mb-3">
          JSON Data
        </label>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          className="w-full h-96 px-4 py-3 bg-dark border border-gray-700 rounded text-white font-mono text-sm focus:border-primary focus:outline-none"
          placeholder="Paste your JSON data here..."
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleImport}
            disabled={importing || !jsonData}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 px-6 py-3 rounded text-white transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiUpload /> {importing ? 'Importing...' : 'Import Movies'}
          </button>
          <button
            onClick={() => setJsonData('')}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Import Results</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FiCheck className="text-3xl text-green-400" />
                <div>
                  <p className="text-green-200 text-sm">Successful</p>
                  <p className="text-3xl font-bold text-white">{result.success}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FiX className="text-3xl text-red-400" />
                <div>
                  <p className="text-red-200 text-sm">Failed</p>
                  <p className="text-3xl font-bold text-white">{result.failed}</p>
                </div>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <h3 className="text-red-300 font-semibold mb-2">Errors:</h3>
              <ul className="list-disc list-inside space-y-1 text-red-200 text-sm">
                {result.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => router.push('/admin')}
            className="mt-4 bg-primary hover:bg-red-700 px-6 py-2 rounded text-white transition"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Sample Data Preview */}
      <div className="bg-darkGray rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Sample Data Structure</h2>
        <pre className="bg-dark p-4 rounded overflow-x-auto text-sm text-gray-300">
          {JSON.stringify(sampleData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
