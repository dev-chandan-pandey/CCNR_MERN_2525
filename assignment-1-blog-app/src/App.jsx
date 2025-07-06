import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Assuming axios is available for data fetching

// Base URL for the dummy JSON API
const API_BASE_URL = 'https://dummyjson.com';

// --- Navbar Component ---
// Visible on all pages, provides navigation links.
const Navbar = ({ navigateTo }) => {
  return (
    <nav className="bg-blue-700 p-4 shadow-md rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">My Blog</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigateTo('/')}
            className="text-white hover:text-blue-200 font-medium transition-colors duration-200 ease-in-out px-3 py-2 rounded-md hover:bg-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('/about')}
            className="text-white hover:text-blue-200 font-medium transition-colors duration-200 ease-in-out px-3 py-2 rounded-md hover:bg-blue-600"
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- HomePage Component ---
// Displays a filterable list of blog posts.
const HomePage = ({ navigateTo }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch blog posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts by title based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) {
      return posts;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [posts, searchTerm]);

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">Loading posts...</div>
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Blog Posts</h2>
      <input
        type="text"
        placeholder="Search posts by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg mb-8 shadow-sm"
      />

      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No posts found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => navigateTo(`/post/${post.id}`)}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- PostDetailsPage Component ---
// Displays full content of a single post based on ID.
const PostDetailsPage = ({ postId, navigateTo }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error(`Error fetching post ${postId}:`, err);
        setError(`Failed to load post ${postId}. It might not exist or there was a network error.`);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]); // Re-fetch if postId changes

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">Loading post details...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-600 bg-red-100 border border-red-200 rounded-lg mx-auto max-w-md">
        {error}
        <button
          onClick={() => navigateTo('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8 text-lg text-gray-500">Post not found.</div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <button
        onClick={() => navigateTo('/')}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
      >
        &larr; Back to Posts
      </button>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">{post.body}</p>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AboutPage Component ---
// Static content about the project or author.
const AboutPage = ({ navigateTo }) => {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About This Blog App</h2>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 leading-relaxed text-gray-700">
        <p className="mb-4">
          This is a simple blog application built with React to demonstrate fundamental concepts such as component-based architecture, state management, data fetching, and a basic form of routing.
        </p>
        <p className="mb-4">
          It fetches blog post data from the <a href="https://dummyjson.com/posts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DummyJSON API</a> and presents it in a user-friendly interface.
        </p>
        {/* FIX: Moved <ul> outside of <p> tag to fix DOM nesting warning */}
        <p className="mb-4">
          Key features include:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 mb-4"> {/* Added mb-4 for spacing */}
          <li>Displaying a list of blog posts on the homepage.</li>
          <li>Filtering posts by title using a search input.</li>
          <li>Viewing full post details on a dedicated page.</li>
          <li>Simple navigation between different sections of the app.</li>
        </ul>
        <p>
          This project serves as a practical example for understanding how to build single-page applications (SPAs) with React.
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

// --- Main App Component (Handles "Routing") ---
const App = () => {
  // State to manage the current "path" or view
  // Format: '/', '/about', '/post/123'
  const [currentPath, setCurrentPath] = useState('/');

  // Function to simulate navigation
  const navigateTo = (path) => {
    setCurrentPath(path);
  };

  // Determine which component to render based on currentPath
  const renderPage = () => {
    if (currentPath === '/') {
      return <HomePage navigateTo={navigateTo} />;
    } else if (currentPath === '/about') {
      return <AboutPage navigateTo={navigateTo} />;
    } else if (currentPath.startsWith('/post/')) {
      // Extract post ID from the path (e.g., '/post/123' -> '123')
      const postId = currentPath.split('/')[2];
      return <PostDetailsPage postId={postId} navigateTo={navigateTo} />;
    }
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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
      <Navbar navigateTo={navigateTo} />
      <div className="flex-grow"> {/* Allows content to take remaining height */}
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
