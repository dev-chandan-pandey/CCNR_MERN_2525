import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is available for data fetching

// IMPORTANT: Replace with your actual OpenWeatherMap API Key
const OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// IMPORTANT: Replace with your actual Google Maps Embed API Key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
const GOOGLE_MAPS_EMBED_BASE_URL = 'https://www.google.com/maps/embed/v1/place';


// --- HomePage Component ---
// Displays a search input for city name.
const HomePage = ({ navigateTo }) => {
  const [city, setCity] = useState('');

  /**
   * Handles the form submission.
   * Prevents default form behavior and navigates to the weather details page.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigateTo(`/weather/${encodeURIComponent(city.trim())}`);
    } else {
      alert("Please enter a city name!"); // Using alert for simplicity
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-200 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Weather Dashboard
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., London)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
            aria-label="City name input"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
          >
            Get Weather
          </button>
        </form>
      </div>
    </div>
  );
};

// --- WeatherDetailsPage Component ---
// Displays weather details and an embedded map for a specific city.
const WeatherDetailsPage = ({ city, navigateTo }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      setWeatherData(null); // Clear previous data

      if (!city) {
        setError("No city provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(OPENWEATHERMAP_BASE_URL, {
          params: {
            q: decodeURIComponent(city), // Decode city name for API call
            appid: OPENWEATHERMAP_API_KEY,
            units: 'metric', // For Celsius, use 'imperial' for Fahrenheit
          },
        });
        setWeatherData(response.data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        if (err.response && err.response.status === 404) {
          setError(`City "${decodeURIComponent(city)}" not found. Please try again.`);
        } else {
          setError("Failed to fetch weather data. Please check your API key or network connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]); // Re-fetch when city changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-xl text-gray-700">
        Loading weather for {decodeURIComponent(city)}...
      </div>
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

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-xl text-gray-500">
        No weather data available.
      </div>
    );
  }

  // Extract relevant weather information
  const { name, main, weather } = weatherData;
  const temperature = main.temp;
  const humidity = main.humidity;
  const weatherCondition = weather[0] ? weather[0].description : 'N/A';
  const iconCode = weather[0] ? weather[0].icon : '';
  const weatherIconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';

  // Google Maps Embed URL
  const googleMapsEmbedUrl =
    `${GOOGLE_MAPS_EMBED_BASE_URL}?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(name)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-green-100 flex flex-col items-center p-6 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 text-center mb-8">
        <button
          onClick={() => navigateTo('/')}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
        >
          &larr; Back to Search
        </button>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{name}</h2>
        {weatherIconUrl && (
          <img
            src={weatherIconUrl}
            alt={weatherCondition}
            className="mx-auto w-24 h-24 mb-4"
          />
        )}
        <p className="text-5xl font-bold text-blue-700 mb-4">{temperature}°C</p>
        <p className="text-2xl text-gray-700 mb-2 capitalize">Condition: {weatherCondition}</p>
        <p className="text-xl text-gray-600">Humidity: {humidity}%</p>
      </div>

      {/* Google Map Embed (Bonus) */}
      {GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && (
        <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Location Map</h3>
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}> {/* 16:9 Aspect Ratio */}
            <iframe
              title={`Google Map of ${name}`}
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              onError={(e) => console.error("Error loading Google Map:", e)}
            ></iframe>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Map might not load if Google Maps Embed API key is invalid or restrictions are set.
          </p>
        </div>
      )}
      {GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' && (
        <p className="text-red-500 text-center mt-4">
          Please provide a valid Google Maps Embed API Key to display the map.
        </p>
      )}
    </div>
  );
};

// --- Main App Component (Handles "Routing") ---
const App = () => {
  // State to manage the current "path" or view
  // Format: '/', '/weather/London'
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
      return <HomePage navigateTo={navigateTo} />;
    } else if (currentPath.startsWith('/weather/')) {
      // Extract city name from the path (e.g., '/weather/London' -> 'London')
      const cityName = currentPath.split('/')[2];
      return <WeatherDetailsPage city={cityName} navigateTo={navigateTo} />;
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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
      {renderPage()}
    </div>
  );
};

export default App;
