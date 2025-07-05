import React, { useState } from 'react';

// Main To-Do List component
const App = () => {
  // State to hold the list of tasks. Each task is an object: { id: string, text: string, completed: boolean }
  const [tasks, setTasks] = useState([]);
  // State to hold the current input value for new tasks
  const [input, setInput] = useState('');

  /**
   * Handles adding a new task to the list.
   * Ensures the input is not empty before adding.
   */
  const addTask = () => {
    // Bug Fix 1: Ensure only non-empty tasks can be added.
    // Trim whitespace from the input. If empty after trimming, do not add the task.
    if (input.trim() === '') {
      // Optionally, provide user feedback here (e.g., an alert or temporary message)
      console.log("Task input cannot be empty.");
      return;
    }

    // Create a new task object with a unique ID, the input text, and initial completed status as false.
    // Bug Fix 3 (related to key prop): Using crypto.randomUUID() for a truly unique and stable ID.
    const newTask = {
      id: crypto.randomUUID(), // Generates a unique ID for the task
      text: input.trim(), // Use trimmed input text
      completed: false,
    };

    // Update the tasks state by adding the new task.
    // Use the spread operator to create a new array, ensuring immutability.
    setTasks((prevTasks) => [...prevTasks, newTask]);
    // Clear the input field after adding the task.
    setInput('');
  };

  /**
   * Toggles the completion status of a task by its ID.
   * @param {string} id - The unique ID of the task to toggle.
   */
  const toggleComplete = (id) => {
    // Create a new array by mapping over the existing tasks.
    // For the task with the matching ID, create a new object with the toggled 'completed' status.
    // For other tasks, return them as they are.
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    // Update the tasks state with the new array.
    setTasks(newTasks);
  };

  /**
   * Deletes a task from the list by its ID.
   * @param {string} id - The unique ID of the task to delete.
   */
  const deleteTask = (id) => {
    // Bug Fix 3: Ensure the "Delete Task" button always removes the correct task.
    // Use the filter method to create a new array that excludes the task with the matching ID.
    // This correctly removes the task without relying on unstable array indices.
    const newTasks = tasks.filter((task) => task.id !== id);
    // Update the tasks state with the filtered array.
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">To-Do List</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add new task"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            aria-label="Add new task input"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 ease-in-out text-lg"
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {/* Map over the tasks array to render each task item */}
          {tasks.map((task) => (
            // Bug Fix 3 (related to key prop): Use task.id as the key for stability.
            // This is crucial for lists where items can be added, removed, or reordered.
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm text-lg"
            >
              <span
                onClick={() => toggleComplete(task.id)}
                // Bug Fix 2: Apply strike-through for completed tasks.
                // Conditionally apply Tailwind's 'line-through' class based on task.completed status.
                className={`flex-grow cursor-pointer select-none ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
                style={{
                  // Fallback for textDecoration, though Tailwind class is preferred
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out text-base"
                aria-label={`Delete task: ${task.text}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
