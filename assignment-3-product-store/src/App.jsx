import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Assuming axios is available for data fetching

// Base URL for the dummy JSON API
const API_BASE_URL = 'https://dummyjson.com';

// --- ProductCard Component ---
// Displays a single product in the list view.
const ProductCard = ({ product, navigateTo }) => {
  return (
    <div
      className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
      onClick={() => navigateTo(`/product/${product.id}`)}
    >
      <img
        src={product.thumbnail || `https://placehold.co/300x200/cccccc/000000?text=No+Image`}
        alt={product.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if placeholder also fails
          e.target.src = `https://placehold.co/300x200/cccccc/000000?text=Image+Error`;
        }}
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2 capitalize">Category: {product.category}</p>
      <p className="text-2xl font-bold text-blue-700 mt-auto">${product.price.toFixed(2)}</p>
    </div>
  );
};

// --- ProductListPage Component ---
// Displays all products with filtering and sorting options.
const ProductListPage = ({ navigateTo }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(`${API_BASE_URL}/products`);
        setProducts(productsResponse.data.products);

        // Fetch categories
        const categoriesResponse = await axios.get(`${API_BASE_URL}/products/categories`);
          console.log(categoriesResponse.data);
        setCategories(['All', ...categoriesResponse.data]); // Add 'All' option
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products or categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...products];

    // 1. Filter by category
    if (selectedCategory !== 'All') {
      currentProducts = currentProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 2. Sort by price
    if (sortOrder === 'asc') {
      currentProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      currentProducts.sort((a, b) => b.price - a.price);
    }

    return currentProducts;
  }, [products, selectedCategory, sortOrder]);

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">Loading products...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-600 bg-red-100 border border-red-200 rounded-lg mx-auto max-w-md">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h2>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl shadow-inner">
        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="categoryFilter" className="text-gray-700 font-semibold">Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white w-full"
          >
            {categories.map((category, index) => { // Added index for unique key
              // Ensure category is a string before using string methods
              const categoryString = String(category.slug);
              return (
                // FIX: Use a combination of categoryString and index for a unique key
                <option key={`${categoryString}-${index}`} value={categoryString}>
                  {categoryString.charAt(0).toUpperCase() + categoryString.slice(1).replace(/-/g, ' ')}
                </option>
              );
            })}
          </select>
        </div>

        {/* Sort by Price */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="sortOrder" className="text-gray-700 font-semibold">Sort by Price:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white w-full"
          >
            <option value="none">None</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- ProductDetailsPage Component ---
// Displays full content of a single product based on ID.
const ProductDetailsPage = ({ productId, navigateTo }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null); // Clear previous product data

      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error(`Error fetching product ${productId}:`, err);
        if (err.response && err.response.status === 404) {
          setError(`Product with ID "${productId}" not found.`);
        } else {
          setError("Failed to load product details. Please check network connection.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]); // Re-fetch if productId changes

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">Loading product details...</div>
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
          Go Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8 text-lg text-gray-500">Product data not available.</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <button
        onClick={() => navigateTo('/')}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
      >
        &larr; Back to Products
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/400x300/cccccc/000000?text=No+Image`}
            alt={product.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300/cccccc/000000?text=Image+Error`;
            }}
          />
        </div>
        <div className="md:w-1/2 text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">{product.title}</h2>
          <p className="text-3xl font-bold text-blue-700 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>
          <p className="text-gray-600 text-md mb-2">
            <span className="font-semibold">Category:</span>{' '}
            <span className="capitalize">{product.category}</span>
          </p>
          <p className="text-gray-600 text-md mb-2">
            <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
          </p>
          <p className="text-gray-600 text-md">
            <span className="font-semibold">Rating:</span> {product.rating} (from {product.reviews ? product.reviews.length : 'N/A'} reviews)
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Handles "Routing") ---
const App = () => {
  // State to manage the current "path" or view
  // Format: '/', '/product/123'
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
      return <ProductListPage navigateTo={navigateTo} />;
    } else if (currentPath.startsWith('/product/')) {
      // Extract product ID from the path (e.g., '/product/123' -> '123')
      const productId = currentPath.split('/')[2];
      return <ProductDetailsPage productId={productId} navigateTo={navigateTo} />;
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
