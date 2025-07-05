import React, { useState } from 'react';

// Main To-Do List App component
const App = () => {
  // Requirement: Initialize state with an array of sample tasks.
  // State to manage the list of tasks (array of strings).
  const [tasks, setTasks] = useState(["Buy milk", "Study React"]);
  // State to manage the input field for new tasks.
  const [newTaskInput, setNewTaskInput] = useState('');

  /**
   * Handles adding a new task to the list.
   * Bonus: Validates input to avoid adding empty tasks.
   */
  const handleAddTask = () => {
    // Trim whitespace from the input.
    const trimmedTask = newTaskInput.trim();

    // Bonus: Validate input to avoid adding empty tasks.
    if (trimmedTask === '') {
      alert("Task cannot be empty!"); // Using alert for simplicity as per general instructions
      return; // Exit if input is empty
    }

    // Add the new task to the existing tasks array.
    // Use a functional update and spread operator to ensure immutability.
    setTasks((prevTasks) => [...prevTasks, trimmedTask]);
    // Clear the input field after adding the task.
    setNewTaskInput('');
  };

  /**
   * Handles clearing all tasks from the list.
   * Resets the tasks array to an empty array.
   */
  const handleClearAllTasks = () => {
    // Requirement: Add a "Clear All" button to reset the list to an empty array.
    setTasks([]); // Set tasks to an empty array
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          My To-Do List
        </h1>

        {/* Input field and Add Task button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyPress={(e) => { // Allows adding task by pressing Enter key
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
            aria-label="New task input"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            aria-label="Add task"
          >
            Add Task
          </button>
        </div>

        {/* Display the list of tasks */}
        {tasks.length === 0 ? (
          // Bonus: Display a message when the list is empty.
          <p className="text-center text-gray-500 text-lg py-4">No tasks available. Start adding some!</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {tasks.map((task, index) => (
              // Using index as key is acceptable here as tasks are only added/cleared, not reordered or deleted individually.
              <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm text-lg text-gray-800 text-left">
                {task}
              </li>
            ))}
          </ul>
        )}

        {/* Clear All button */}
        {tasks.length > 0 && ( // Only show "Clear All" if there are tasks
          <button
            onClick={handleClearAllTasks}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105 w-full"
            aria-label="Clear all tasks"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
