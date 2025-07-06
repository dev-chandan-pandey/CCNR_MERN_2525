import React, { useState, useContext, createContext } from 'react';

// 1. Create an Authentication Context
// This context will hold the authentication status (isLoggedIn)
// and the functions to change that status (login, logout).
const AuthContext = createContext(null); // Default value can be null or an initial object

// --- Navbar Component ---
// This component consumes the AuthContext to display login/logout button.
const Navbar = () => {
  // Use useContext to get the authentication state and functions from the AuthContext.
  const { isLoggedIn, login, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-700 p-4 shadow-md flex justify-between items-center rounded-t-xl">
      <h2 className="text-white text-2xl font-bold">My App</h2>
      <button
        onClick={isLoggedIn ? logout : login} // Toggle login/logout based on current state
        className={`py-2 px-5 rounded-lg font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105
                    ${isLoggedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        aria-label={isLoggedIn ? 'Logout button' : 'Login button'}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

// --- Main Component ---
// This component consumes the AuthContext to display a message based on auth status.
const Main = () => {
  // Use useContext to get the authentication state.
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <main className="flex-grow p-8 flex items-center justify-center bg-blue-50 text-center rounded-b-xl">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Main Content Area</h2>
        {isLoggedIn ? (
          <p className="text-green-600 text-xl font-semibold">
            You are currently logged in! Welcome back.
          </p>
        ) : (
          <p className="text-red-600 text-xl font-semibold">
            Please log in to access full features.
          </p>
        )}
      </div>
    </main>
  );
};

// --- Footer Component ---
// This component consumes the AuthContext to conditionally display a message.
const Footer = () => {
  // Use useContext to get the authentication state.
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <footer className="bg-gray-800 p-4 text-white text-center text-lg rounded-b-xl mt-auto shadow-inner">
      {isLoggedIn ? (
        <p>Welcome, User!</p> // Conditional display when logged in
      ) : (
        <p>Please log in to continue.</p> // Conditional display when logged out
      )}
    </footer>
  );
};

// --- Main App Component ---
const App = () => {
  // State to manage the authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Functions to update the authentication state
  const login = () => {
    setIsLoggedIn(true);
    alert("You have logged in!"); // Using alert as per general instructions
    console.log("User logged in.");
  };

  const logout = () => {
    setIsLoggedIn(false);
    alert("You have logged out."); // Using alert as per general instructions
    console.log("User logged out.");
  };

  // The value provided to the context. This object will be accessible by all consumers.
  const authContextValue = {
    isLoggedIn,
    login,
    logout,
  };

  return (
    // 2. AuthContext.Provider: Wraps the entire application (or the part that needs auth context).
    // The 'value' prop contains the state and functions to be shared.
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen flex flex-col bg-gray-100 font-inter p-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col flex-grow">
          <Navbar /> {/* Navbar consumes AuthContext */}
          <Main />   {/* Main consumes AuthContext */}
          <Footer /> {/* Footer consumes AuthContext */}
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
