import React, { useState, useEffect, useRef } from 'react';
// Import Tone.js for sound effects. It's loaded via CDN in a real HTML file.
// For this React component, we'll assume Tone is globally available or imported.
// If running in a direct HTML file, ensure:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
// is included in the <head> or before this script.

// Main App component for the Stopwatch
const App = () => {
  // State to store the elapsed seconds.
  const [seconds, setSeconds] = useState(0);
  // State to control whether the stopwatch is running or paused.
  const [isRunning, setIsRunning] = useState(false);
  // State to store the user-defined target time. Default to 10 seconds.
  const [targetTime, setTargetTime] = useState(10);
  // State to track if the sound has been played for the current target hit.
  const [soundPlayed, setSoundPlayed] = useState(false);

  // useRef to hold the Tone.js Synth instance.
  // Using useRef ensures the synth object persists across re-renders without re-creating.
  const synthRef = useRef(null);

  // useEffect to initialize Tone.js Synth once when the component mounts.
  useEffect(() => {
    // Dynamically import Tone.js to ensure it's loaded before use.
    // This is a common pattern when using external libraries that might not be bundled.
    // In a Canvas environment, Tone is often globally available.
    if (window.Tone) {
      synthRef.current = new window.Tone.Synth().toDestination();
    } else {
      console.warn("Tone.js not found. Sound effects will be disabled.");
    }

    // Cleanup function: Dispose of the synth when the component unmounts.
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []); // Empty dependency array means this effect runs only once on mount.

  // useEffect to manage the setInterval for the stopwatch logic.
  // This effect runs whenever 'isRunning', 'seconds', or 'targetTime' changes.
  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;

          // Check if the new time reaches the target time and sound hasn't been played yet.
          if (newSeconds === targetTime && !soundPlayed) {
            if (synthRef.current) {
              // Play a 'C4' note for an '8n' (eighth note) duration.
              synthRef.current.triggerAttackRelease("C4", "8n");
              console.log(`Sound played at ${targetTime} seconds!`);
            } else {
              console.log(`Target time ${targetTime} seconds reached! (Sound disabled: Tone.js not loaded)`);
            }
            setSoundPlayed(true); // Mark sound as played for this target hit.
          }
          return newSeconds;
        });
      }, 1000); // Update every 1000 milliseconds (1 second).
    }

    // Cleanup function: Clear the interval when the component unmounts or
    // when 'isRunning' becomes false (stop button is clicked).
    return () => clearInterval(intervalId);
  }, [isRunning, seconds, targetTime, soundPlayed]); // Dependencies for this effect.

  /**
   * Handles the "Start" button click.
   * Starts the stopwatch and resets the soundPlayed flag.
   */
  const handleStart = () => {
    setIsRunning(true);
    setSoundPlayed(false); // Allow sound to play again if target is hit after restarting.
  };

  /**
   * Handles the "Stop" button click.
   * Pauses the stopwatch.
   */
  const handleStop = () => {
    setIsRunning(false);
  };

  /**
   * Bonus: Handles the "Reset" button click.
   * Resets the stopwatch to 0, stops it, and resets the soundPlayed flag.
   */
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setSoundPlayed(false);
  };

  /**
   * Bonus: Handles changes to the target time input.
   * Updates the targetTime state.
   */
  const handleTargetTimeChange = (e) => {
    // Parse the input value as an integer. Default to 0 if invalid.
    const newTarget = parseInt(e.target.value, 10) || 0;
    setTargetTime(newTarget);
    // If target time changes, reset soundPlayed to allow sound on next hit.
    setSoundPlayed(false); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          React Stopwatch
        </h1>

        {/* Display elapsed seconds */}
        <div className="text-6xl font-extrabold text-blue-700 mb-8">
          {seconds}s
        </div>

        {/* Bonus: Allow user to set their own target time using an input. */}
        <div className="mb-6">
          <label htmlFor="targetTime" className="block text-gray-700 text-lg font-medium mb-2">
            Set Target Time (seconds):
          </label>
          <input
            type="number"
            id="targetTime"
            value={targetTime}
            onChange={handleTargetTimeChange}
            min="1" // Minimum target time
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg text-center shadow-sm"
            aria-label="Set target time in seconds"
          />
        </div>

        {/* Start, Stop, and Reset buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            disabled={isRunning} // Disable Start button if already running
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            disabled={!isRunning} // Disable Stop button if not running
          >
            Stop
          </button>
          {/* Bonus: Add a Reset button. */}
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105"
            disabled={seconds === 0 && !isRunning} // Disable Reset if already at 0 and not running
          >
            Reset
          </button>
        </div>

        {/* Display message when target time is reached */}
        {seconds >= targetTime && targetTime > 0 && (
          <p className="mt-8 text-xl font-semibold text-purple-600 animate-pulse">
            Target Time Reached! ({targetTime}s)
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
