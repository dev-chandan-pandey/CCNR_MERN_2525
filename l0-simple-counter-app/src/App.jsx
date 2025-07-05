import React, { useState } from 'react';

// Main Counter App component
const App = () => {
  // State to manage the count, initialized to 0
  const [count, setCount] = useState(0);

  /**
   * Handles incrementing the count by 1.
   * Uses a functional update to ensure the latest state is used.
   */
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  /**
   * Handles decrementing the count by 1.
   * Bonus: Prevents the count from going below 0.
   * Uses a functional update.
   */
  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };

  /**
   * Handles resetting the count back to 0.
   */
  const handleReset = () => {
    setCount(0);
  };

  // Bonus: Determine if the goal is reached
  const isGoalReached = count === 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Simple Counter
        </h1>

        {/* Display the current count */}
        <p className="text-7xl font-bold text-green-700 mb-8 transition-transform transform duration-300 ease-out">
          {count}
        </p>

        {/* Bonus: Show "Goal Reached!" message */}
        {isGoalReached && (
          <p className="text-xl font-semibold text-purple-600 mb-6 animate-pulse">
            Goal Reached! 🎉
          </p>
        )}

        {/* Buttons for counter operations */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleIncrement}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            aria-label="Increment count"
          >
            Increment
          </button>
          <button
            onClick={handleDecrement}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            aria-label="Decrement count"
            disabled={count === 0} // Disable if count is 0 to prevent going below
          >
            Decrement
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            aria-label="Reset count to zero"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
