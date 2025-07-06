import React, { useState, useEffect } from 'react';

// ThemedBox Component: Displays content with theme-dependent styling
const ThemedBox = ({ theme, children }) => {
  // Determine background and text colors based on the 'theme' prop
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-600';

  return (
    <div
      className={`p-6 rounded-xl shadow-lg border ${bgColor} ${textColor} ${borderColor}
                  transition-colors duration-300 ease-in-out w-full max-w-xs mx-auto text-center`}
    >
      <h3 className="text-xl font-semibold mb-3">Themed Box ({theme})</h3>
      <p>{children}</p>
    </div>
  );
};

// ThemeApp Component: Manages theme state and renders ThemedBox components
const App = () => {
  // Requirement: Create a ThemeApp component with light and dark theme toggle using useState.
  // Bonus: Store the theme in localStorage using useEffect to persist on reload.
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage, default to 'light' if not found
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme || 'light';
  });

  // useEffect to save the theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    // Apply global background and text color to the body for a full theme effect
    document.body.className = theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-800 text-gray-50';
  }, [theme]); // Dependency array: runs whenever 'theme' changes

  /**
   * Toggles the current theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-inter
                    ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-800 text-gray-50'}
                    transition-colors duration-300 ease-in-out`}>
      
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-600 text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-6">Theme Toggle App</h1>
        <p className="text-lg mb-6">Current Theme: <span className="font-bold capitalize">{theme}</span></p>
        
        <button
          onClick={toggleTheme}
          className={`py-3 px-6 rounded-lg font-bold text-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105
                      ${theme === 'light'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'}
                      `}
          aria-label={`Toggle to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          Toggle Theme
        </button>
      </div>

      {/* Render 2-3 boxes to show the effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <ThemedBox theme={theme}>
          This box dynamically changes its background and text color based on the selected theme.
        </ThemedBox>
        <ThemedBox theme={theme}>
          It's a reusable component, demonstrating how props enable flexible design.
        </ThemedBox>
        <ThemedBox theme={theme}>
          The theme state is managed in the parent and passed down.
        </ThemedBox>
      </div>
    </div>
  );
};

export default App;
