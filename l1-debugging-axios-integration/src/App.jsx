import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is installed or available via CDN in a real setup

// Mock API URL for demonstration. In a real app, replace with your Firebase URL.
// Example Firebase Realtime Database structure:
// {
//   "tasks": {
//     "-Mx_abc123": { "name": "Learn React Hooks", "completed": false },
//     "-Mx_def456": { "name": "Build a ToDo App", "completed": true }
//   }
// }
const FIREBASE_API_URL = 'https://jsonplaceholder.typicode.com/todos'; // Using a public mock API for demonstration
// If using actual Firebase, it would look like:
// const FIREBASE_API_URL = 'https://YOUR_PROJECT_ID.firebaseio.com/tasks.json';

// TaskList component to fetch and display tasks
const App = () => {
  // State to store the list of tasks.
  // Each task object will have an 'id' and 'name' (or 'title' from mock API).
  const [tasks, setTasks] = useState([]);
  // State to manage any error messages during data fetching.
  const [errorMessage, setErrorMessage] = useState(null);
  // State to manage loading status.
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches data from the specified API URL.
   * Handles successful response by transforming Firebase object data into an array.
   * Handles errors by setting an error message.
   */
  const fetchData = async () => {
    setIsLoading(true); // Set loading to true before fetching
    setErrorMessage(null); // Clear any previous error messages

    try {
      const response = await axios.get(FIREBASE_API_URL);

      // Issue 1 & 2 Fix: Firebase Realtime DB returns an object of objects.
      // We need to convert this into an array of objects, where each object
      // includes its Firebase-generated key as an 'id' for React's 'key' prop.
      // Handle cases where response.data might be null (e.g., no tasks yet).
      if (response.data) {
        // For JSONPlaceholder, data is already an array of objects with 'id' and 'title'.
        // If it were Firebase Realtime DB, the transformation would be:
        // const tasksArray = Object.keys(response.data).map(key => ({
        //   id: key,
        //   ...response.data[key]
        // }));
        // setTasks(tasksArray);

        // For JSONPlaceholder, directly use the data, but map 'title' to 'name' for consistency
        // with the original problem's <li>{task.name}</li>
        const transformedTasks = response.data.map(item => ({
          id: item.id,
          name: item.title // Map 'title' from JSONPlaceholder to 'name'
        }));
        setTasks(transformedTasks);
      } else {
        setTasks([]); // If no data, set tasks to an empty array
      }
    } catch (error) {
      // Issue 3 Fix: Add error handling to display an error message to the user.
      console.error("Error fetching tasks:", error);
      setErrorMessage("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading to false after fetch attempt
    }
  };

  // useEffect hook to call fetchData when the component mounts.
  // The empty dependency array `[]` ensures it runs only once.
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Task List
        </h1>

        {isLoading && (
          <p className="text-center text-blue-600 text-lg mb-4">Loading tasks...</p>
        )}

        {errorMessage && (
          <p className="text-center text-red-600 text-lg mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && tasks.length === 0 && (
          <p className="text-center text-gray-500 text-lg">No tasks found.</p>
        )}

        {!isLoading && !errorMessage && tasks.length > 0 && (
          <ul className="space-y-3">
            {tasks.map((task) => (
              // Issue 2 Fix: Each <li> must have a unique key prop.
              // We now use task.id, which is derived from Firebase's unique keys
              // or directly from the mock API's 'id'.
              <li key={task.id} className="bg-gray-50 p-3 rounded-lg shadow-sm text-lg text-gray-800 text-left">
                {task.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
