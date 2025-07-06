import React, { useState, useContext, createContext } from 'react';

// --- AuthContext.js Content (integrated for self-containment) ---
// 1. Create AuthContext
export const AuthContext = createContext(null);

// 2. AuthContextProvider Component (Definition kept as per problem, but not used directly in App's return)
export const AuthContextProvider = ({ children }) => {
  // Note: These state and toggle functions will be managed directly in the App component below
  // when AuthContext.Provider is used directly. This component definition is here
  // to satisfy the problem's initial structure, but its direct use is bypassed for the fix.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn(!isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- ThemeContext.js Content (integrated for self-containment) ---
// 1. Create ThemeContext
export const ThemeContext = createContext(null);

// 2. ThemeContextProvider Component (Definition kept as per problem, but not used directly in App's return)
export const ThemeContextProvider = ({ children }) => {
  // Note: These state and toggle functions will be managed directly in the App component below
  // when ThemeContext.Provider is used directly. This component definition is here
  // to satisfy the problem's initial structure, but its direct use is bypassed for the fix.
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- MainAppContent Component ---
// This component now contains the main application UI and consumes the contexts.
const MainAppContent = () => {
  // Consume AuthContext to get login status and toggle function
  const { isLoggedIn, toggleAuth } = useContext(AuthContext);
  // Consume ThemeContext to get current theme and toggle function
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Determine background and text colors based on the current theme
  const navbarBgClass = theme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const navbarTextColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const footerBgClass = theme === 'light' ? 'bg-gray-300' : 'bg-gray-900';
  const footerTextColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-600';
  const cardTextColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const mainBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800';

  // Helper function to get Tailwind classes for buttons based on colorScheme
  const getButtonColorSchemeClasses = (colorScheme) => {
    switch (colorScheme) {
      case 'red': return 'bg-red-500 hover:bg-red-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-inter">
      {/* Navbar Issues: Fixed toggle buttons and theme-based background */}
      <nav
        className={`p-4 shadow-md flex justify-between items-center rounded-t-xl ${navbarBgClass} ${navbarTextColorClass}`}
      >
        <p className="text-xl font-bold">My App</p>
        <div className="flex gap-4">
          <button
            onClick={toggleAuth}
            className={`py-2 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out ${getButtonColorSchemeClasses(isLoggedIn ? 'red' : 'green')}`}
          >
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
          <button
            onClick={toggleTheme}
            className={`py-2 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out ${getButtonColorSchemeClasses(theme === 'light' ? 'purple' : 'orange')}`}
          >
            Toggle to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </nav>

      {/* Main Content Issues: Fixed responsive grid and theme-based card background */}
      <div className={`flex-1 p-4 ${mainBgClass}`}>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-lg mx-auto"
        >
          {['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5', 'Card 6'].map((card) => (
            <div
              key={card}
              className={`p-6 shadow-md rounded-lg text-center text-lg font-semibold transition-colors duration-300 ease ${cardBgClass} ${cardTextColorClass}`}
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Issues: Fixed background color for the active theme */}
      <footer
        className={`p-4 text-center text-md shadow-inner ${footerBgClass} ${footerTextColorClass}`}
      >
        <p>
          Footer Content - Current Theme: <span className="font-bold capitalize">{theme}</span>
          {isLoggedIn ? ' | Logged In' : ' | Logged Out'}
        </p>
      </footer>
    </div>
  );
};

// --- Main App Component (Default Export) ---
// This component now acts as the entry point and provides the contexts.
const App = () => {
  // State for AuthContext - managed directly in App
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn(!isLoggedIn);

  // State for ThemeContext - managed directly in App
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    // Directly use ThemeContext.Provider and AuthContext.Provider
    // passing the state and toggle functions managed in this App component.
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
        <MainAppContent /> {/* Render the actual application content here */}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
