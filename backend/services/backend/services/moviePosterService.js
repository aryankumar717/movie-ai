
import dotenv from 'dotenv';
dotenv.config();

const OMDB_API_KEY = process.env.OMDB_API_KEY || '';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

if (!OMDB_API_KEY || OMDB_API_KEY === 'your_api_key_here') {
  console.warn('⚠️  OMDB_API_KEY not configured in moviePosterService');
} else {
  console.log('✅ OMDB_API_KEY loaded in moviePosterService');
}

/**
 * Generate watch provider links for a movie
 * These are search links to popular streaming platforms
 * @param {string} movieTitle - The movie title
 * @param {string} year - The movie release year (optional)
 * @returns {Array<{provider: string, link: string, type: string, logo: string}>}
 */
function getWatchProviderLinks(movieTitle, year = '') {
  const searchQuery = encodeURIComponent(year ? `${movieTitle} ${year}` : movieTitle);
  const titleOnly = encodeURIComponent(movieTitle);
  
  return [
    {
      provider: 'Netflix',
      link: `https://www.netflix.com/search?q=${titleOnly}`,
      type: 'stream',
      logo: 'https://images.justwatch.com/icon/207360008/s100/netflix.webp'
    },
    {
      provider: 'Amazon Prime',
      link: `https://www.amazon.com/s?k=${searchQuery}&i=instant-video`,
      type: 'stream',
      logo: 'https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp'
    },
    {
      provider: 'Disney+',
      link: `https://www.disneyplus.com/search?q=${titleOnly}`,
      type: 'stream',
      logo: 'https://images.justwatch.com/icon/147638351/s100/disneyplus.webp'
    },
    {
      provider: 'Hulu',
      link: `https://www.hulu.com/search?q=${titleOnly}`,
      type: 'stream',
      logo: 'https://images.justwatch.com/icon/116305230/s100/hulu.webp'
    },
    {
      provider: 'Apple TV',
      link: `https://tv.apple.com/search?term=${titleOnly}`,
      type: 'stream',
      logo: 'https://images.justwatch.com/icon/190848813/s100/appletvplus.webp'
    },
    {
      provider: 'Google Play',
      link: `https://play.google.com/store/search?q=${searchQuery}&c=movies`,
      type: 'rent',
      logo: 'https://images.justwatch.com/icon/169478387/s100/googleplaymovies.webp'
    },
    {
      provider: 'YouTube',
      link: `https://www.youtube.com/results?search_query=${searchQuery}+full+movie`,
      type: 'rent',
      logo: 'https://images.justwatch.com/icon/59562423/s100/youtube.webp'
    },
    {
      provider: 'JustWatch',
      link: `https://www.justwatch.com/us/search?q=${titleOnly}`,
      type: 'search',
      logo: 'https://www.justwatch.com/appassets/img/JustWatch-logo-large.webp'
    }
  ];
}

/**
 * Search for a movie by title and return movie data including poster
 * @param {string} movieTitle - The title of the movie to search for
 * @returns {Promise<{id: string|null, title: string, poster: string|null, year: string|null}>}
 */
async function searchMovie(movieTitle) {
  try {
    const cleanTitle = movieTitle.replace(/^MOVIE\s+\d+:\s*/i, '').trim();
    
    if (!OMDB_API_KEY || OMDB_API_KEY === 'your_api_key_here') {
      return { id: null, title: cleanTitle, poster: null, year: null };
    }

    // Use 't' parameter to get the first match with full details
    const searchUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(cleanTitle)}&type=movie`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      return { id: null, title: cleanTitle, poster: null, year: null };
    }

    const data = await response.json();
    
    // OMDB returns Response: "False" if not found
    if (data.Response === 'False' || !data.Title) {
      console.log(`⚠️  No OMDB result for "${cleanTitle}"`);
      return { id: null, title: cleanTitle, poster: null, year: null };
    }

    const posterUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : null;

    return {
      id: data.imdbID,
      title: data.Title,
      poster: posterUrl,
      year: data.Year
    };
  } catch (error) {
    console.error(`❌ Error searching for "${movieTitle}":`, error.message);
    return { id: null, title: movieTitle.replace(/^MOVIE\s+\d+:\s*/i, '').trim(), poster: null, year: null };
  }
}

/**
 * Search for a movie by title and return the poster URL
 * @param {string} movieTitle - The title of the movie to search for
 * @returns {Promise<string|null>} - The poster URL or null if not found
 */
export async function getMoviePoster(movieTitle) {
  const movieData = await searchMovie(movieTitle);
  return movieData.poster;
}

/**
 * Get complete movie data including poster and watch provider links
 * @param {string} movieTitle - The title of the movie
 * @returns {Promise<{title: string, poster: string|null, watchProviders: Array, imdbId: string|null}>}
 */
export async function getMovieData(movieTitle) {
  const cleanTitle = movieTitle.replace(/^MOVIE\s+\d+:\s*/i, '').trim();
  const movieInfo = await searchMovie(movieTitle);
  
  // Generate watch provider search links
  const watchProviders = getWatchProviderLinks(movieInfo.title || cleanTitle, movieInfo.year);
  
  return {
    title: movieInfo.title || cleanTitle,
    poster: movieInfo.poster,
    year: movieInfo.year,
    watchProviders: watchProviders,
    imdbId: movieInfo.id
  };
}

/**
 * Batch fetch posters for multiple movies
 * @param {string[]} movieTitles - Array of movie titles
 * @returns {Promise<Array<{title: string, poster: string|null}>>}
 */
export async function getMoviePosters(movieTitles) {
  const results = await Promise.all(
    movieTitles.map(async (title) => ({
      title: title.replace(/^MOVIE\s+\d+:\s*/i, '').trim(),
      poster: await getMoviePoster(title),
    }))
  );
  
  return results;
}

/**
 * Batch fetch complete movie data including posters
 * @param {string[]} movieTitles - Array of movie titles
 * @returns {Promise<Array<{title: string, poster: string|null, watchProviders: Array}>>}
 */
export async function getMoviesWithWatchProviders(movieTitles) {
  const results = await Promise.all(
    movieTitles.map(async (title) => await getMovieData(title))
  );
  
  return results;
}
