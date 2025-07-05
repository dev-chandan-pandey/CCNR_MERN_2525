import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for making HTTP requests

// --- Configuration ---
// IMPORTANT: Replace this with your actual Firebase Realtime Database URL if you are using Firebase.
// Example Firebase URL: 'https://YOUR_PROJECT_ID.firebaseio.com/users.json'
// For this demo, we'll use JSONPlaceholder for GET requests and simulate others.
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Regular expression for basic email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- User Management System Component ---
const App = () => {
  // State to store the list of users fetched from the API
  const [users, setUsers] = useState([]);
  // State for the new user form inputs
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  // State for the user currently being edited (null if no user is being edited)
  const [editingUser, setEditingUser] = useState(null); // { id: null, name: '', email: '' }
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState(null);
  // State to manage validation errors for the new/edit user form
  const [validationErrors, setValidationErrors] = useState({});
  // State to control visibility of the Add User form
  const [showAddForm, setShowAddForm] = useState(false);

  /**
   * Helper function to validate user data (name and email).
   * @param {object} userData - The user object with name and email.
   * @returns {object} An object containing error messages for invalid fields, or empty if valid.
   */
  const validateUser = (userData) => {
    const errors = {};
    if (!userData.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!userData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(userData.email)) {
      errors.email = 'Invalid email format.';
    }
    return errors;
  };

  /**
   * Fetches the list of users from the API.
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // For JSONPlaceholder, we fetch from /users
      const response = await axios.get(`${API_BASE_URL}/users`);
      
      // --- Firebase Realtime DB Specific Transformation (commented out) ---
      // If using Firebase Realtime DB, the response.data might be an object of objects:
      // { "-Mx_abc123": { name: "...", email: "..." }, "-Mx_def456": { name: "...", email: "..." } }
      // You would need to transform it into an array like this:
      // const usersArray = response.data ? Object.keys(response.data).map(key => ({
      //   id: key, // Use Firebase's unique key as the user ID
      //   ...response.data[key]
      // })) : [];
      // setUsers(usersArray);

      // For JSONPlaceholder, data is already an array of user objects with id, name, email.
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Handles adding a new user.
   */
  const handleAddUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const errors = validateUser(newUser);
    setValidationErrors(errors); // Update validation errors state

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please correct the form errors.');
      return; // Stop if there are validation errors
    }

    setErrorMessage(null); // Clear previous errors
    try {
      // --- Simulate POST request for demonstration ---
      // For JSONPlaceholder, POST requests will return a new object but won't actually
      // persist it on the server. So we simulate success and then re-fetch.
      console.log('Simulating POST request to add user:', newUser);
      // If using Firebase, it would be:
      // const response = await axios.post(FIREBASE_API_URL, newUser);
      // console.log('User added to Firebase:', response.data);

      // Simulate a successful response with a temporary ID for immediate UI update
      const tempId = Date.now().toString(); // Simple unique ID for simulation
      const addedUser = { id: tempId, ...newUser };
      
      // Optimistically update UI (optional, but good for responsiveness)
      setUsers(prevUsers => [...prevUsers, addedUser]);
      
      setNewUser({ name: '', email: '' }); // Clear form
      setShowAddForm(false); // Hide add form
      alert('User added successfully (simulated)!'); // Using alert as per general instructions
      
      // Re-fetch users to get the actual state from the backend (important for real APIs)
      // For JSONPlaceholder, this ensures the list is consistent with the read-only nature.
      fetchUsers();

    } catch (error) {
      console.error('Error adding user:', error);
      setErrorMessage('Failed to add user. Please try again.');
    }
  };

  /**
   * Sets the user to be edited in the form.
   * @param {object} user - The user object to be edited.
   */
  const startEditUser = (user) => {
    setEditingUser({ ...user }); // Copy user data to editing state
    setValidationErrors({}); // Clear validation errors when starting edit
    setErrorMessage(null); // Clear general error message
    setShowAddForm(false); // Hide add form if it's open
  };

  /**
   * Handles updating an existing user.
   */
  const handleUpdateUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const errors = validateUser(editingUser);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please correct the form errors.');
      return;
    }

    setErrorMessage(null);
    try {
      // --- Simulate PATCH/PUT request for demonstration ---
      // For JSONPlaceholder, PATCH/PUT requests will not persist changes.
      console.log('Simulating PATCH request to update user:', editingUser);
      // If using Firebase, it would be:
      // await axios.patch(`${FIREBASE_API_URL.replace('.json', '')}/${editingUser.id}.json`, {
      //   name: editingUser.name,
      //   email: editingUser.email
      // });

      // Optimistically update UI
      setUsers(prevUsers => prevUsers.map(u => u.id === editingUser.id ? editingUser : u));

      setEditingUser(null); // Exit editing mode
      alert('User updated successfully (simulated)!'); // Using alert as per general instructions
      fetchUsers(); // Re-fetch to confirm (important for real APIs)

    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update user. Please try again.');
    }
  };

  /**
   * Handles deleting a user.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleDeleteUser = async (userId) => {
    setErrorMessage(null);
    if (!window.confirm('Are you sure you want to delete this user?')) { // Using window.confirm as per general instructions
      return;
    }

    try {
      // --- Simulate DELETE request for demonstration ---
      // For JSONPlaceholder, DELETE requests will not persist changes.
      console.log('Simulating DELETE request for user ID:', userId);
      // If using Firebase, it would be:
      // await axios.delete(`${FIREBASE_API_URL.replace('.json', '')}/${userId}.json`);

      // Optimistically update UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      alert('User deleted successfully (simulated)!'); // Using alert as per general instructions

      fetchUsers(); // Re-fetch to confirm (important for real APIs)

    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          User Management System
        </h1>

        {/* Error Message Display */}
        {errorMessage && (
          <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6">
            {errorMessage}
          </p>
        )}

        {/* Add User Button & Form */}
        <div className="mb-6 text-center">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingUser(null); // Close edit form if open
              setNewUser({ name: '', email: '' }); // Reset new user form
              setValidationErrors({}); // Clear validation errors
              setErrorMessage(null); // Clear general error
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
          >
            {showAddForm ? 'Hide Add User Form' : 'Add New User'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="newName" className="block text-gray-700 text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  id="newName"
                  value={newUser.name}
                  onChange={(e) => {
                    setNewUser({ ...newUser, name: e.target.value });
                    setValidationErrors({}); // Clear errors on change
                  }}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter name"
                />
                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="newEmail" className="block text-gray-700 text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser({ ...newUser, email: e.target.value });
                    setValidationErrors({}); // Clear errors on change
                  }}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter email"
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Add User
              </button>
            </form>
          </div>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-inner mb-8">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4 text-center">Edit User: {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label htmlFor="editName" className="block text-gray-700 text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  id="editName"
                  value={editingUser.name}
                  onChange={(e) => {
                    setEditingUser({ ...editingUser, name: e.target.value });
                    setValidationErrors({});
                  }}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
                  }`}
                />
                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="editEmail" className="block text-gray-700 text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  id="editEmail"
                  value={editingUser.email}
                  onChange={(e) => {
                    setEditingUser({ ...editingUser, email: e.target.value });
                    setValidationErrors({});
                  }}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
                  }`}
                />
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)} // Cancel editing
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out text-sm"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User List Display */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">User List</h2>
        {isLoading ? (
          <p className="text-center text-blue-600 text-lg">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl shadow-sm bg-gray-50 border border-gray-100"
              >
                <div className="flex-grow text-left mb-2 sm:mb-0">
                  <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => startEditUser(user)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
