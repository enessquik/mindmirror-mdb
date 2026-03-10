// Script to fetch movies and series from TMDB and seed the database
// Run with: node scripts/fetch-tmdb.js

const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindmirror';

const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  imdbId: String,
  tmdbId: String,
  year: Number,
  duration: String,
  seasons: Number,
  episodes: Number,
  genre: [String],
  category: [String],
  thumbnail: String,
  backdrop: String,
  trailer: String,
  rating: Number,
  views: { type: Number, default: 0 },
  featured: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

const TMDB_API_KEY = 'b7be32426cfcc04c7b0463b60d81ed3f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const genreMap = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror',
  10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western'
};

const movieGenreIds = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 27, 10402, 9648, 10749, 878, 53, 10752, 37];
const tvGenreIds   = [10759, 35, 80, 99, 18, 10751, 14, 27, 10402, 9646, 9648, 10749, 878, 10770, 53, 10764, 10765, 10766, 10767, 10768];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

let requestCount = 0;

async function fetchFromTMDB(endpoint, params = {}) {
  try {
    const query = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'tr-TR',
      ...params,
    });
    const url = `${TMDB_BASE_URL}${endpoint}?${query}`;
    requestCount++;
    // Rate limit: ~40 req/10s → wait 260ms every request
    if (requestCount % 35 === 0) await sleep(1000);
    const response = await fetch(url);
    if (response.status === 429) {
      console.log('  Rate limited, waiting 5s...');
      await sleep(5000);
      return fetchFromTMDB(endpoint, params);
    }
    if (!response.ok) throw new Error(`TMDB API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from TMDB:`, error.message);
    return null;
  }
}

function transformMovie(tmdbMovie, type = 'movie', category = ['trending']) {
  const isMovie = type === 'movie';
  const year = isMovie
    ? parseInt(tmdbMovie.release_date?.split('-')[0]) || new Date().getFullYear()
    : parseInt(tmdbMovie.first_air_date?.split('-')[0]) || new Date().getFullYear();

  return {
    title: tmdbMovie.title || tmdbMovie.name,
    description: tmdbMovie.overview,
    type: isMovie ? 'movie' : 'series',
    tmdbId: String(tmdbMovie.id),
    year,
    duration: isMovie ? '2h 0m' : null,
    seasons: isMovie ? null : tmdbMovie.number_of_seasons || null,
    episodes: isMovie ? null : tmdbMovie.number_of_episodes || null,
    genre: (tmdbMovie.genre_ids || []).map(id => genreMap[id]).filter(Boolean),
    category,
    thumbnail: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
    backdrop: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : null,
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    featured: false,
    views: Math.floor(Math.random() * 5000),
  };
}

async function fetchPages(endpoint, label, maxPages, category, mediaType, moviesToAdd, seenIds) {
  console.log(`\n  Fetching ${label}...`);
  let fetched = 0;
  for (let page = 1; page <= maxPages; page++) {
    const data = await fetchFromTMDB(endpoint, { page });
    if (!data || !data.results || data.results.length === 0) break;
    if (page > (data.total_pages || maxPages)) break;

    for (const item of data.results) {
      if (!item.poster_path || !item.backdrop_path) continue;
      const type = mediaType || (item.media_type === 'tv' ? 'tv' : 'movie');
      const id = String(item.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      moviesToAdd.push(transformMovie(item, type, category));
      fetched++;
    }
    process.stdout.write(`\r    Page ${page}/${Math.min(maxPages, data.total_pages || maxPages)} — ${fetched} new items`);
  }
  console.log(`\r    ✓ ${fetched} items added from ${label}                    `);
}

async function fetchDiscover(mediaType, sortBy, label, maxPages, category, moviesToAdd, seenIds) {
  const endpoint = `/discover/${mediaType}`;
  console.log(`\n  Fetching ${label}...`);
  let fetched = 0;
  for (let page = 1; page <= maxPages; page++) {
    const data = await fetchFromTMDB(endpoint, { sort_by: sortBy, page, 'vote_count.gte': 50 });
    if (!data || !data.results || data.results.length === 0) break;
    if (page > (data.total_pages || maxPages)) break;

    for (const item of data.results) {
      if (!item.poster_path || !item.backdrop_path) continue;
      const id = String(item.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      moviesToAdd.push(transformMovie(item, mediaType, category));
      fetched++;
    }
    process.stdout.write(`\r    Page ${page}/${Math.min(maxPages, data.total_pages || maxPages)} — ${fetched} new items`);
  }
  console.log(`\r    ✓ ${fetched} items added from ${label}                    `);
}

async function fetchByGenre(mediaType, genreId, genreName, maxPages, moviesToAdd, seenIds) {
  const endpoint = `/discover/${mediaType}`;
  let fetched = 0;
  for (let page = 1; page <= maxPages; page++) {
    const data = await fetchFromTMDB(endpoint, {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page,
      'vote_count.gte': 20,
    });
    if (!data || !data.results || data.results.length === 0) break;
    if (page > (data.total_pages || maxPages)) break;

    for (const item of data.results) {
      if (!item.poster_path || !item.backdrop_path) continue;
      const id = String(item.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      moviesToAdd.push(transformMovie(item, mediaType, [genreName.toLowerCase()]));
      fetched++;
    }
  }
  if (fetched > 0) process.stdout.write(`  ${genreName}: ${fetched} | `);
  return fetched;
}

async function fetchAndSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const moviesToAdd = [];
    const seenIds = new Set();

    console.log('═══════════════════════════════════════');
    console.log('  PHASE 1: Popular & Trending');
    console.log('═══════════════════════════════════════');

    await fetchPages('/movie/popular',        'Popular Movies',        100, ['popular'],   'movie',  moviesToAdd, seenIds);
    await fetchPages('/tv/popular',           'Popular TV Series',     100, ['popular'],   'tv',     moviesToAdd, seenIds);
    await fetchPages('/trending/all/week',    'Trending (Week)',        20, ['trending'],  null,     moviesToAdd, seenIds);
    await fetchPages('/trending/all/day',     'Trending (Day)',         10, ['trending'],  null,     moviesToAdd, seenIds);

    console.log('\n═══════════════════════════════════════');
    console.log('  PHASE 2: Top Rated');
    console.log('═══════════════════════════════════════');

    await fetchPages('/movie/top_rated',      'Top Rated Movies',       100, ['top-rated'], 'movie', moviesToAdd, seenIds);
    await fetchPages('/tv/top_rated',         'Top Rated TV Series',    100, ['top-rated'], 'tv',    moviesToAdd, seenIds);

    console.log('\n═══════════════════════════════════════');
    console.log('  PHASE 3: Now Playing / Upcoming / On Air');
    console.log('═══════════════════════════════════════');

    await fetchPages('/movie/now_playing',    'Now Playing Movies',      50, ['now-playing'], 'movie', moviesToAdd, seenIds);
    await fetchPages('/movie/upcoming',       'Upcoming Movies',         50, ['upcoming'],    'movie', moviesToAdd, seenIds);
    await fetchPages('/tv/on_the_air',        'On The Air Series',       50, ['on-air'],      'tv',    moviesToAdd, seenIds);
    await fetchPages('/tv/airing_today',      'Airing Today Series',     20, ['on-air'],      'tv',    moviesToAdd, seenIds);

    console.log('\n═══════════════════════════════════════');
    console.log('  PHASE 4: Discover by Sort Order');
    console.log('═══════════════════════════════════════');

    await fetchDiscover('movie', 'vote_average.desc',  'Movies by Rating',          100, ['top-rated'], moviesToAdd, seenIds);
    await fetchDiscover('movie', 'revenue.desc',       'Movies by Revenue',          80, ['popular'],   moviesToAdd, seenIds);
    await fetchDiscover('movie', 'vote_count.desc',    'Movies by Vote Count',       80, ['popular'],   moviesToAdd, seenIds);
    await fetchDiscover('movie', 'release_date.desc',  'Movies by Release Date',     80, ['upcoming'],  moviesToAdd, seenIds);
    await fetchDiscover('tv',    'vote_average.desc',  'TV Series by Rating',        100, ['top-rated'], moviesToAdd, seenIds);
    await fetchDiscover('tv',    'vote_count.desc',    'TV Series by Vote Count',     80, ['popular'],   moviesToAdd, seenIds);
    await fetchDiscover('tv',    'first_air_date.desc','TV Series by Air Date',       80, ['on-air'],    moviesToAdd, seenIds);

    console.log('\n═══════════════════════════════════════');
    console.log('  PHASE 5: By Genre (Movies)');
    console.log('═══════════════════════════════════════');
    console.log('');
    for (const gId of movieGenreIds) {
      await fetchByGenre('movie', gId, genreMap[gId] || 'Other', 15, moviesToAdd, seenIds);
    }

    console.log('\n\n═══════════════════════════════════════');
    console.log('  PHASE 6: By Genre (TV)');
    console.log('═══════════════════════════════════════');
    console.log('');
    const tvGenreMap = {
      10759: 'Action & Adventure', 35: 'Comedy', 80: 'Crime', 99: 'Documentary',
      18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller',
      10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
    };
    for (const gId of tvGenreIds) {
      await fetchByGenre('tv', gId, tvGenreMap[gId] || 'Other', 15, moviesToAdd, seenIds);
    }
    console.log('');

    // ── Summary ──
    console.log('\n═══════════════════════════════════════');
    console.log(`  Total unique items collected: ${moviesToAdd.length}`);
    console.log('═══════════════════════════════════════\n');

    // Clear and insert
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    const batchSize = 200;
    for (let i = 0; i < moviesToAdd.length; i += batchSize) {
      const batch = moviesToAdd.slice(i, i + batchSize);
      await Movie.insertMany(batch, { ordered: false }).catch(() => {});
      const done = Math.min(i + batchSize, moviesToAdd.length);
      process.stdout.write(`\rInserting... ${done}/${moviesToAdd.length}`);
    }

    console.log(`\n\n✅ Database seeded successfully with ${moviesToAdd.length} movies and series!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fetchAndSeed();
