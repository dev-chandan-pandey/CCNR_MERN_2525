import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is available (e.g., via CDN or npm install)

// API endpoint for random quotes
const QUOTE_API_URL = 'https://api.quotable.io/random';

// Main App component for the Daily Quote Generator
const App = () => {
  // State to store the fetched quote content and author
  const [quote, setQuote] = useState({ content: '', author: '' });
  // State to manage the loading status during API calls
  const [isLoading, setIsLoading] = useState(true);
  // State to manage any error messages during API calls
  const [error, setError] = useState(null);

  /**
   * Asynchronous function to fetch a random quote from the API.
   * Handles loading states and error handling.
   */
  const fetchQuote = async () => {
    setIsLoading(true); // Set loading to true before fetching
    setError(null);     // Clear any previous errors

    try {
      const response = await axios.get(QUOTE_API_URL);
      // Display quote content and author.
      setQuote({
        content: response.data.content,
        author: response.data.author,
      });
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Failed to fetch quote. Please try again."); // Set user-friendly error message
      setQuote({ content: '', author: '' }); // Clear quote on error
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt (success or failure)
    }
  };

  // Requirement: Auto-refresh quote every 30 seconds using useEffect.
  // This useEffect handles initial fetch and subsequent auto-refreshes.
  useEffect(() => {
    fetchQuote(); // Fetch quote immediately when component mounts

    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchQuote();
    }, 30000); // 30 seconds (30000 milliseconds)

    // Cleanup function: Clear the interval when the component unmounts
    // or before the effect runs again (if dependencies change, though here it's empty).
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Daily Quote
        </h1>

        {/* Bonus: Add a small animation or loading spinner when a new quote is being fetched. */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-600 text-lg">Loading a fresh quote...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-lg h-40 flex items-center justify-center">{error}</p>
        ) : (
          <div className="mb-8 h-40 flex flex-col justify-center">
            <p className="text-2xl italic text-gray-800 mb-4 leading-relaxed">
              "{quote.content}"
            </p>
            <p className="text-lg font-semibold text-gray-600">
              - {quote.author}
            </p>
          </div>
        )}

        {/* Requirement: Add a “Get New Quote” button. */}
        <button
          onClick={fetchQuote} // Calls the fetchQuote function on click
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
          disabled={isLoading} // Disable button while loading to prevent multiple rapid fetches
        >
          {isLoading ? 'Fetching...' : 'Get New Quote'}
        </button>
      </div>
    </div>
  );
};

export default App;
