import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is available for data fetching

// IMPORTANT: Replace with your actual OMDb API Key
const OMDB_API_KEY = 'YOUR_OMDB_API_KEY';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Placeholder image for when a poster is not available
const PLACEHOLDER_POSTER = 'https://placehold.co/300x450/cccccc/000000?text=No+Poster';

// --- SearchPage Component ---
// Displays a search input for movie titles.
const SearchPage = ({ navigateTo }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedYet, setSearchedYet] = useState(false); // To show message only after a search attempt

  /**
   * Handles the search form submission.
   * Fetches movies by title from OMDb API.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const trimmedTitle = movieTitle.trim();
    if (!trimmedTitle) {
      setError("Please enter a movie title to search.");
      setSearchResults([]);
      setSearchedYet(true); // Indicate a search attempt was made
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]); // Clear previous results
    setSearchedYet(true);

    if (OMDB_API_KEY === 'YOUR_OMDB_API_KEY') {
        setError("OMDb API Key is missing. Please replace 'YOUR_OMDB_API_KEY' with your actual key in the code.");
        setLoading(false);
        return;
    }

    try {
      // Search for movies by title (type 'movie' to ensure only movies are returned)
      const response = await axios.get(OMDB_BASE_URL, {
        params: {
          s: trimmedTitle, // 's' for search by title
          apikey: OMDB_API_KEY,
          type: 'movie', // Ensure only movies are searched
        },
      });

      if (response.data.Response === "True") {
        setSearchResults(response.data.Search);
      } else {
        setError(response.data.Error || "No movies found with that title.");
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      setError("Failed to connect to OMDb API. Please check your internet connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Movie Search
      </h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          placeholder="Search for a movie title (e.g., Inception)"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
          aria-label="Movie title search input"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
        >
          Search
        </button>
      </form>

      {loading && (
        <p className="text-center text-xl text-blue-600 animate-pulse">Loading movies...</p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto text-center">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!loading && !error && searchedYet && searchResults.length === 0 && (
        <p className="text-center text-xl text-gray-500">No movies found. Try a different title!</p>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {searchResults.map((movie) => (
            <div
              key={movie.imdbID} // imdbID is unique for each movie
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col items-center text-center"
              onClick={() => navigateTo(`/movie/${movie.imdbID}`)}
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER}
                alt={`${movie.Title} Poster`}
                className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">{movie.Title}</h3>
              <p className="text-gray-600 text-sm">{movie.Year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MovieDetailsPage Component ---
// Displays detailed information about a specific movie.
const MovieDetailsPage = ({ imdbID, navigateTo }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      setMovieDetails(null);

      if (!imdbID) {
        setError("No movie ID provided.");
        setLoading(false);
        return;
      }

      if (OMDB_API_KEY === 'YOUR_OMDB_API_KEY') {
          setError("OMDb API Key is missing. Please replace 'YOUR_OMDB_API_KEY' with your actual key in the code.");
          setLoading(false);
          return;
      }

      try {
        // Fetch movie details by IMDb ID
        const response = await axios.get(OMDB_BASE_URL, {
          params: {
            i: imdbID, // 'i' for search by IMDb ID
            apikey: OMDB_API_KEY,
            plot: 'full', // Request full plot
          },
        });

        if (response.data.Response === "True") {
          setMovieDetails(response.data);
        } else {
          setError(response.data.Error || "Movie details not found.");
        }
      } catch (err) {
        console.error(`Error fetching movie ${imdbID} details:`, err);
        setError("Failed to fetch movie details. Please check your internet connection or API key.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]); // Re-fetch details if imdbID changes

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-blue-600 animate-pulse">Loading movie details...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
        <button
          onClick={() => navigateTo('/')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Go Back to Search
        </button>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="text-center py-8 text-xl text-gray-500">Movie details not available.</div>
    );
  }

  // Destructure movie details for easier access
  const { Title, Year, Genre, Plot, Poster, imdbRating, Director, Actors } = movieDetails;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <button
        onClick={() => navigateTo('/')}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
      >
        &larr; Back to Search
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={Poster !== 'N/A' ? Poster : PLACEHOLDER_POSTER}
            alt={`${Title} Poster`}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_POSTER; }}
          />
        </div>
        <div className="md:w-2/3 text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">{Title}</h2>
          <p className="text-xl text-gray-700 mb-4">({Year})</p>
          
          <div className="mb-4">
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
              Genre: {Genre || 'N/A'}
            </span>
            {imdbRating && imdbRating !== 'N/A' && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                IMDb Rating: {imdbRating} ⭐
              </span>
            )}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">{Plot || 'Plot not available.'}</p>

          <div className="border-t border-gray-200 pt-4 mt-4 text-gray-700">
            <p className="mb-2">
              <span className="font-semibold">Director:</span> {Director || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Actors:</span> {Actors || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Handles "Routing") ---
const App = () => {
  // State to manage the current "path" or view
  // Format: '/', '/movie/tt1234567'
  const [currentPath, setCurrentPath] = useState('/');

  /**
   * Function to simulate navigation.
   * Updates the currentPath state.
   * @param {string} path - The new path to navigate to.
   */
  const navigateTo = (path) => {
    setCurrentPath(path);
  };

  // Determine which component to render based on currentPath
  const renderPage = () => {
    if (currentPath === '/') {
      return <SearchPage navigateTo={navigateTo} />;
    } else if (currentPath.startsWith('/movie/')) {
      // Extract IMDb ID from the path (e.g., '/movie/tt1234567' -> 'tt1234567')
      const imdbID = currentPath.split('/')[2];
      return <MovieDetailsPage imdbID={imdbID} navigateTo={navigateTo} />;
    }
    // Fallback for unknown paths (e.g., a simple 404 or redirect to home)
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-xl text-red-500 p-4">
        404 - Page Not Found.
        <button
          onClick={() => navigateTo('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }; // Removed the extra closing parenthesis here

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
      {renderPage()}
    </div>
  );
};

export default App;
