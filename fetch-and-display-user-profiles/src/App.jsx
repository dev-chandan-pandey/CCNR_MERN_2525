import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Axios is assumed to be available

// API endpoint for fetching user data
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

// UserCard Component: Displays individual user's details
// Requirement: Display users using a UserCard component (name, email, city).
const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
      {/* User Icon (using Lucide React for a simple icon) */}
      {/* Note: Lucide React icons are not directly available in this environment without specific setup.
          For a quick demo, we'll use a simple circle/person SVG or fallback to emoji.
          If lucide-react were available, it would look like: <UserCircle className="w-16 h-16 text-blue-500 mb-4" />
      */}
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-circle text-blue-500 mb-4">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="10" r="3"/>
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
      </svg>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
      <p className="text-blue-600 text-md mb-1">{user.email}</p>
      <p className="text-gray-600 text-sm">{user.address.city}</p>
    </div>
  );
};

// Main App Component for User Profile Viewer
const App = () => {
  // State to store the fetched user data
  const [users, setUsers] = useState([]);
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);
  // Bonus: State for the search term
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetches user data from the API.
   * Handles loading and error states.
   */
  const fetchUsers = async () => {
    setIsLoading(true); // Set loading to true before fetching
    setError(null);     // Clear any previous errors

    try {
      const response = await axios.get(USERS_API_URL);
      setUsers(response.data); // Set the fetched users to state
    } catch (err) {
      console.error("Error fetching users:", err);
      // Requirement: Handle error state and display a friendly message if API fails.
      setError("Failed to load user profiles. Please check your internet connection or try again later.");
      setUsers([]); // Clear users on error
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt
    }
  };

  // Requirement: On load, fetch data using useEffect.
  useEffect(() => {
    fetchUsers(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once on mount

  // Bonus: Filter users by name (case-insensitive) using useMemo for performance.
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users; // If no search term, return all users
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [users, searchTerm]); // Recalculate only when users or searchTerm change

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          User Profiles
        </h1>

        {/* Bonus: Add a search input to filter users by name (case-insensitive). */}
        <div className="mb-8 w-full">
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
            aria-label="Search user by name"
          />
        </div>

        {/* Conditional rendering based on loading, error, or data availability */}
        {isLoading ? (
          // Requirement: Show a loading text until data arrives.
          <div className="flex flex-col items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-600 text-lg">Loading user profiles...</p>
          </div>
        ) : error ? (
          // Requirement: Handle error state and display a friendly message if API fails.
          <p className="text-red-600 text-lg p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            {error}
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">No users found matching your search.</p>
        ) : (
          // Display users using a UserCard component
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
