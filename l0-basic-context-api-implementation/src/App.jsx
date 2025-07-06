import React, { useState, useContext, createContext } from 'react';

// 1. Create a Theme Context
// We export it so that other components can import and use it.
// createContext can take a default value, which is used if a component
// tries to consume context without a Provider above it.
const ThemeContext = createContext('light'); // Default theme is 'light'

// --- Nested Component 1: ThemeDisplay ---
// This component consumes the theme from ThemeContext and displays it.
const ThemeDisplay = () => {
  // Use useContext hook to consume the value from ThemeContext.
  const theme = useContext(ThemeContext);

  // Conditional styling based on the current theme
  const bgColor = theme === 'light' ? 'bg-blue-100' : 'bg-blue-800';
  const textColor = theme === 'light' ? 'text-blue-900' : 'text-blue-100';
  const borderColor = theme === 'light' ? 'border-blue-200' : 'border-blue-700';

  return (
    <div className={`p-5 rounded-lg shadow-md border ${bgColor} ${textColor} ${borderColor}
                    transition-colors duration-300 ease-in-out mb-6 w-full`}>
      <h3 className="text-xl font-semibold mb-2">ThemeDisplay Component</h3>
      <p>Current Theme: <span className="font-bold capitalize">{theme}</span></p>
      <p className="text-sm mt-2">
        (This component directly consumes context)
      </p>
    </div>
  );
};

// --- Nested Component 2: DeeplyNestedComponent ---
// This component is nested even further and also consumes the theme.
const DeeplyNestedComponent = () => {
  // Use useContext hook to consume the value from ThemeContext.
  const theme = useContext(ThemeContext);

  // Conditional styling based on the current theme
  const bgColor = theme === 'light' ? 'bg-purple-100' : 'bg-purple-800';
  const textColor = theme === 'light' ? 'text-purple-900' : 'text-purple-100';
  const borderColor = theme === 'light' ? 'border-purple-200' : 'border-purple-700';

  return (
    <div className={`p-4 rounded-lg shadow-inner border ${bgColor} ${textColor} ${borderColor}
                    transition-colors duration-300 ease-in-out w-full`}>
      <h4 className="text-lg font-medium mb-1">DeeplyNested Component</h4>
      <p>Theme from Context: <span className="font-bold capitalize">{theme}</span></p>
      <p className="text-xs mt-2">
        (This component is nested and also consumes context)
      </p>
    </div>
  );
};

// --- Intermediate Component (not consuming, but rendering nested) ---
const IntermediateComponent = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-100 mb-6 w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Intermediate Component</h3>
      <p className="text-gray-600 mb-4 text-center">
        (This component does NOT consume context, but its children do)
      </p>
      <DeeplyNestedComponent />
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  // State to manage the current theme: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  /**
   * Toggles the theme state between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Determine global background and text color based on the theme
  const appBgColor = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const appTextColor = theme === 'light' ? 'text-gray-900' : 'text-gray-50';
  const appBorderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  return (
    // 2. ThemeContext.Provider: Wraps the components that need access to the context value.
    // The 'value' prop is where you pass the actual data (our 'theme' state).
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-inter
                      ${appBgColor} ${appTextColor} transition-colors duration-300 ease-in-out`}>
        
        <div className={`bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border ${appBorderColor} text-center mb-8`}>
          <h1 className="text-4xl font-extrabold mb-6">Context API Theme Toggle</h1>
          <p className="text-lg mb-6">Current Theme (from App state): <span className="font-bold capitalize">{theme}</span></p>
          
          {/* Button to toggle the theme */}
          <button
            onClick={toggleTheme}
            className={`py-3 px-6 rounded-lg font-bold text-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105
                        ${theme === 'light'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'}
                        `}
            aria-label={`Toggle to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            Toggle Theme
          </button>
        </div>

        {/* Nested components that will consume the theme */}
        <div className="w-full max-w-lg space-y-4">
          <ThemeDisplay /> {/* Directly consumes theme */}
          <IntermediateComponent /> {/* Renders DeeplyNestedComponent, which consumes theme */}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
