import React, { useState, useContext, createContext } from 'react';

// --- 1. Create UserContext ---
// This context will hold the user data and the function to update it.
export const UserContext = createContext(null);

// --- 2. UserProvider Component ---
// This component will manage the user state and provide it to its children.
export const UserProvider = ({ children }) => {
  // Mock user data as initial state
  const [userData, setUserData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  });

  // Function to update user data
  const updateUserData = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData }));
  };

  // The value prop makes userData and updateUserData available to any consuming component
  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// --- Navbar Component ---
// Provides navigation links to different routes.
const Navbar = ({ navigateTo }) => {
  return (
    <nav className="bg-blue-700 p-4 shadow-md rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">User App</h1>
        <div className="space-x-4 flex">
          <button
            onClick={() => navigateTo('/')}
            className="text-white hover:text-blue-200 font-medium transition-colors duration-200 ease-in-out px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('/profile')}
            className="text-white hover:text-blue-200 font-medium transition-colors duration-200 ease-in-out px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Profile
          </button>
          <button
            onClick={() => navigateTo('/settings')}
            className="text-white hover:text-blue-200 font-medium transition-colors duration-200 ease-in-out px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- HomePage Component ---
// Simple welcome page.
const HomePage = () => {
  const { userData } = useContext(UserContext); // Access user data from context

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h2>
      <p className="text-lg text-gray-600">
        Hello, <span className="font-semibold text-blue-700">{userData.name}</span>!
        This application demonstrates global state management using React's Context API.
      </p>
      <p className="text-md text-gray-500 mt-2">
        Navigate using the links above to view your profile or update your settings.
      </p>
    </div>
  );
};

// --- ProfilePage Component ---
// Displays user profile information from the context.
const ProfilePage = () => {
  const { userData } = useContext(UserContext); // Consume user data from context

  return (
    <div className="container mx-auto p-6 max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Profile</h2>
      <div className="space-y-4 text-left">
        <p className="text-lg text-gray-700">
          <span className="font-semibold text-blue-700">Name:</span> {userData.name}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold text-blue-700">Email:</span> {userData.email}
        </p>
      </div>
    </div>
  );
};

// --- SettingsPage Component ---
// Allows updating user profile information, which updates the context.
const SettingsPage = ({ navigateTo }) => {
  const { userData, updateUserData } = useContext(UserContext); // Consume and update user data

  // Local state for form inputs, initialized with current context data
  const [nameInput, setNameInput] = useState(userData.name);
  const [emailInput, setEmailInput] = useState(userData.email);

  /**
   * Handles the form submission to update user data.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (nameInput.trim() === '' || emailInput.trim() === '') {
      alert('Name and Email cannot be empty.');
      return;
    }
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      alert('Please enter a valid email address.');
      return;
    }

    // Update the global user data via the context's update function
    updateUserData({ name: nameInput.trim(), email: emailInput.trim() });
    alert('Profile updated successfully!');
    navigateTo('/profile'); // Navigate back to profile page after update
  };

  return (
    <div className="container mx-auto p-6 max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2 text-left">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2 text-left">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

// --- Main App Component (Handles "Routing") ---
const App = () => {
  // State to manage the current "path" or view
  // Format: '/', '/profile', '/settings'
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
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage navigateTo={navigateTo} />;
      default:
        // Fallback for unknown paths (e.g., a simple 404 or redirect to home)
        return (
          <div className="text-center py-8 text-xl text-red-500">
            404 - Page Not Found.
            <button
              onClick={() => navigateTo('/')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </div>
        );
    }
  };

  return (
    // Wrap the entire application with UserProvider to make context available
    <UserProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
        <Navbar navigateTo={navigateTo} />
        <div className="flex-grow flex items-center justify-center"> {/* Center content vertically and horizontally */}
          {renderPage()}
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
