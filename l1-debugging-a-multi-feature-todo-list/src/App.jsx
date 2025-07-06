import React, { useState, useMemo } from 'react';

// Define the priority order for sorting
const PRIORITY_ORDER = {
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

// Main App component for the Advanced Task Manager
const App = () => {
  // State for all tasks. Each task has a unique ID, title, priority, and completion status.
  const [tasks, setTasks] = useState([]);
  // State for the new task input title
  const [newTaskTitle, setNewTaskTitle] = useState('');
  // State for the new task input priority, defaulting to 'Medium'
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  // State for filtering tasks by priority (e.g., 'All', 'High', 'Medium', 'Low')
  const [filterPriority, setFilterPriority] = useState('All');
  // State for filtering tasks by completion status (e.g., 'All', 'Completed', 'Incomplete')
  const [filterStatus, setFilterStatus] = useState('All');

  /**
   * Handles adding a new task to the list.
   * Ensures the task title is not empty.
   */
  const addTask = () => {
    // Trim whitespace from the input title
    const trimmedTitle = newTaskTitle.trim();

    // Requirement: Ensure only non-empty tasks can be added.
    if (trimmedTitle === '') {
      alert('Task title cannot be empty!'); // Using alert as per general instructions for simple messages
      return;
    }

    // Create a new task object with a unique ID, trimmed title, selected priority, and default incomplete status.
    const newTask = {
      id: crypto.randomUUID(), // Generate a unique ID for the task
      title: trimmedTitle,
      priority: newTaskPriority,
      completed: false,
    };

    // Update the tasks state by adding the new task.
    // Use a functional update to ensure we're working with the latest state.
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      // Requirement: Tasks are sorted dynamically whenever a new task is added.
      // Sort the tasks immediately after adding, based on priority.
      return updatedTasks.sort((a, b) => {
        // Sort by priority (High to Low)
        const priorityComparison = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        if (priorityComparison !== 0) {
          return priorityComparison;
        }
        // Optional: If priorities are the same, sort alphabetically by title
        return a.title.localeCompare(b.title);
      });
    });

    // Clear the input fields after adding the task.
    setNewTaskTitle('');
    setNewTaskPriority('Medium');
  };

  /**
   * Toggles the completion status of a task by its ID.
   * @param {string} id - The unique ID of the task to toggle.
   */
  const toggleComplete = (id) => {
    // Map over the tasks to create a new array.
    // For the task with the matching ID, toggle its 'completed' status.
    // For other tasks, return them as they are.
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Deletes a task from the list by its ID.
   * @param {string} id - The unique ID of the task to delete.
   */
  const deleteTask = (id) => {
    // Filter the tasks to create a new array that excludes the task with the matching ID.
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  /**
   * Memoized computation for filtered and sorted tasks.
   * This re-runs only when 'tasks', 'filterPriority', or 'filterStatus' change.
   */
  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = [...tasks]; // Start with a copy of all tasks

    // Apply priority filter
    if (filterPriority !== 'All') {
      currentTasks = currentTasks.filter((task) => task.priority === filterPriority);
    }

    // Apply completion status filter
    if (filterStatus === 'Completed') {
      currentTasks = currentTasks.filter((task) => task.completed);
    } else if (filterStatus === 'Incomplete') {
      currentTasks = currentTasks.filter((task) => !task.completed);
    }

    // No need to sort here explicitly if tasks are already sorted on state update.
    // However, if filtering changes the order implicitly (e.g., by removing elements),
    // or if we want to ensure consistent sorting after filtering, we can re-sort.
    // For this implementation, sorting is handled when `setTasks` is called.
    // The `tasks` array itself is always kept sorted by priority.

    return currentTasks;
  }, [tasks, filterPriority, filterStatus]); // Dependencies for memoization

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Advanced Task Manager
        </h1>

        {/* Input and Add Task Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter new task title"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
            aria-label="New task title"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg bg-white shadow-sm"
            aria-label="New task priority"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
          >
            Add Task
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl shadow-inner">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <label htmlFor="priorityFilter" className="text-gray-700 font-semibold text-base">Filter by Priority:</label>
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-white w-full sm:w-auto"
              aria-label="Filter tasks by priority"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <label htmlFor="statusFilter" className="text-gray-700 font-semibold text-base">Filter by Status:</label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-white w-full sm:w-auto"
              aria-label="Filter tasks by completion status"
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        {/* Task List Section */}
        <ul className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <li className="text-center text-gray-500 text-lg py-4">No tasks to display.</li>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <li
                key={task.id} // Use unique ID as key for stable list rendering
                className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition duration-200 ease-in-out
                  ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'}
                  ${task.priority === 'High' && !task.completed ? 'border-l-4 border-red-500 bg-red-50' : 'border-l-4 border-transparent'}
                `}
              >
                <div className="flex-grow mr-4">
                  <span
                    onClick={() => toggleComplete(task.id)}
                    className={`cursor-pointer text-xl font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                  <p className={`text-sm mt-1 ${
                    task.priority === 'High' && !task.completed ? 'text-red-600 font-semibold' : 'text-gray-600'
                  }`}>
                    Priority: {task.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`py-2 px-4 rounded-lg font-semibold text-sm transition duration-200 ease-in-out
                      ${task.completed ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {task.completed ? 'Uncomplete' : 'Complete'}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
