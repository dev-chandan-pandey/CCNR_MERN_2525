import React, { useState, useContext, createContext } from 'react';

// --- AuthContext ---
// 1. Create AuthContext
export const AuthContext = createContext(null);

// --- ThemeContext ---
// 1. Create ThemeContext
export const ThemeContext = createContext(null);

// --- Navbar Component ---
const Navbar = ({ onOpen }) => {
  const { isLoggedIn, toggleAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Determine colors based on theme
  const bgColorClass = theme === 'light' ? 'bg-blue-700' : 'bg-gray-800';
  const textColorClass = 'text-white'; // Text color is always white for contrast

  // Helper function for button styling
  const getButtonClasses = (isPrimary, isRed, isGreen, isPurple, isOrange) => {
    let classes = 'py-2 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105';
    if (isPrimary) {
      if (isRed) classes += ' bg-red-500 hover:bg-red-600';
      else if (isGreen) classes += ' bg-green-500 hover:bg-green-600';
      else if (isPurple) classes += ' bg-purple-500 hover:bg-purple-600';
      else if (isOrange) classes += ' bg-orange-500 hover:bg-orange-600';
    }
    return classes;
  };

  return (
    <nav
      className={`p-4 shadow-md flex justify-between items-center rounded-t-xl ${bgColorClass} ${textColorClass} z-10`}
    >
      <div className="flex items-center space-x-4">
        {/* Hamburger Icon for mobile - hidden on md and up */}
        <button
          onClick={onOpen}
          className="md:hidden p-2 rounded-md hover:bg-white/20 transition-colors"
          aria-label="Open Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <p className="text-2xl font-bold">Dashboard</p>
      </div>

      <div className="flex items-center space-x-4">
        <p className="text-lg">
          Status: <span className="font-semibold">{isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
        </p>
        <button
          onClick={toggleTheme}
          className={getButtonClasses(true, false, false, theme === 'light', theme === 'dark')}
        >
          Toggle to {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button
          onClick={toggleAuth}
          className={getButtonClasses(true, isLoggedIn, !isLoggedIn, false, false)}
        >
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>
      </div>
    </nav>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Determine colors based on theme
  const bgColorClass = theme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const textColorClass = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const borderColorClass = theme === 'light' ? 'border-gray-200' : 'border-gray-600';

  // Helper for sidebar button styling
  const getSidebarButtonClasses = () => {
    return `w-full text-left py-2 px-4 rounded-lg transition-colors hover:bg-${theme === 'light' ? 'gray-200' : 'gray-600'} ${textColorClass}`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block w-64 p-4 shadow-md border-r ${bgColorClass} ${textColorClass} ${borderColorClass} transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col space-y-4">
          <p className="text-xl font-bold mb-4">Navigation</p>
          {isLoggedIn ? (
            <p className="text-lg text-green-500">
              Welcome, User!
            </p>
          ) : (
            <p className="text-lg text-red-500">
              Please log in.
            </p>
          )}
          <button className={getSidebarButtonClasses()}>Dashboard</button>
          <button className={getSidebarButtonClasses()}>Products</button>
          <button className={getSidebarButtonClasses()}>Settings</button>
        </div>
      </aside>

      {/* Mobile Drawer/Sidebar Simulation */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose} // Close drawer when overlay is clicked
        >
          <div
            className={`fixed top-0 left-0 h-full w-64 p-4 shadow-lg ${bgColorClass} ${textColorClass} transition-transform duration-300 ease-in-out transform translate-x-0`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/20 transition-colors"
              aria-label="Close Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-xl font-bold mb-6 border-b pb-2" style={{borderColor: borderColorClass.split('-').pop()}}>Navigation</p>
            <div className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <p className="text-lg text-green-500">
                  Welcome, User!
                </p>
              ) : (
                <p className="text-lg text-red-500">
                  Please log in.
                </p>
              )}
              <button className={getSidebarButtonClasses()} onClick={onClose}>Dashboard</button>
              <button className={getSidebarButtonClasses()} onClick={onClose}>Products</button>
              <button className={getSidebarButtonClasses()} onClick={onClose}>Settings</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Main Content Area Component ---
const MainContent = () => {
  const { theme } = useContext(ThemeContext);

  // Sample product data
  const products = [
    { id: 1, name: 'Laptop Pro X' },
    { id: 2, name: 'Wireless Headphones' },
    { id: 3, name: 'Ergonomic Mouse' },
    { id: 4, name: '4K Monitor' },
    { id: 5, name: 'Mechanical Keyboard' },
    { id: 6, name: 'Webcam HD' },
  ];

  // Determine card colors based on theme
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-600';
  const cardTextColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const cardBorderColorClass = theme === 'light' ? 'border-gray-200' : 'border-gray-500';
  const mainBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const headingColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const subTextColorClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  return (
    <div className={`flex-1 p-6 ${mainBgClass}`}>
      <p className={`text-3xl font-bold mb-6 ${headingColorClass}`}>
        Featured Products
      </p>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`p-5 shadow-md rounded-lg ${cardBgClass} ${cardTextColorClass} border ${cardBorderColorClass} text-center transition-all duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-xl`}
          >
            <p className="text-xl font-semibold">
              {product.name}
            </p>
            <p className={`text-sm mt-2 ${subTextColorClass}`}>
              Product ID: {product.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Footer Component ---
const Footer = () => {
  const { theme } = useContext(ThemeContext);

  // Determine colors based on theme
  const bgColorClass = theme === 'light' ? 'bg-gray-300' : 'bg-gray-900';
  const textColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';

  return (
    <footer
      className={`p-4 text-center text-lg shadow-inner mt-auto ${bgColorClass} ${textColorClass}`}
    >
      <p className="text-md">
        &copy; 2024 Dashboard. Current Theme: <span className="font-bold capitalize">{theme}</span>
      </p>
    </footer>
  );
};

// --- Main App Component ---
const App = () => {
  // State for AuthContext - managed directly in App
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAuth = () => setIsLoggedIn(!isLoggedIn);

  // State for ThemeContext - managed directly in App
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // useDisclosure hook replaced by useState for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onOpen = () => setIsSidebarOpen(true);
  const onClose = () => setIsSidebarOpen(false);

  return (
    // Directly use ThemeContext.Provider and AuthContext.Provider
    // passing the state and toggle functions managed in this App component.
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ isLoggedIn, toggleAuth }}>
        <div className="flex flex-col min-h-screen font-inter">
          <Navbar onOpen={onOpen} />
          <div className="flex flex-1">
            <Sidebar isOpen={isSidebarOpen} onClose={onClose} />
            <MainContent />
          </div>
          <Footer />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
