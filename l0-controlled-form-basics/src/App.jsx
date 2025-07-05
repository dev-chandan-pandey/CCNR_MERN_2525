import React, { useState } from 'react';

// Main App component for the Controlled Form
const App = () => {
  // Requirement: Use useState to manage the value of the input.
  // 'username' will hold the current value of the input field.
  // 'setUsername' is the function to update this state.
  const [username, setUsername] = useState('');
  // State to manage the error message, if any.
  const [errorMessage, setErrorMessage] = useState('');
  // State to show the submitted message
  const [submittedMessage, setSubmittedMessage] = useState('');

  /**
   * Handles changes to the username input field.
   * This is crucial for a controlled component: it updates the state
   * with the current value of the input as the user types.
   * @param {Object} e - The event object from the input's onChange.
   */
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Clear any existing error message as the user types
    setErrorMessage('');
    setSubmittedMessage(''); // Clear submitted message on new input
  };

  /**
   * Handles the form submission.
   * @param {Object} e - The event object from the form's onSubmit.
   */
  const handleSubmit = (e) => {
    // Prevent the default browser behavior of refreshing the page on form submission.
    e.preventDefault();

    // Requirement: Display an error message if the input is empty when submitted.
    if (username.trim() === '') {
      setErrorMessage('Username is required!');
      // Problem statement asks for alert, but custom message box is preferred for Canvas.
      // Using alert here to strictly follow the problem statement.
      alert('Username is required!');
      setSubmittedMessage(''); // Clear any previous submitted message
    } else {
      // Requirement: Display the submitted value in an alert if valid.
      // Problem statement asks for alert, but custom message box is preferred for Canvas.
      // Using alert here to strictly follow the problem statement.
      alert(`Submitted Username: ${username}`);
      setSubmittedMessage(`Successfully submitted: "${username}"`);
      // Optionally, clear the input field after successful submission
      setUsername('');
      setErrorMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Controlled Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="username" className="block text-gray-700 text-lg font-medium mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username} // Requirement: Use useState to manage the value of the input.
              onChange={handleUsernameChange} // Updates state as input changes.
              placeholder="Enter your username"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } text-lg shadow-sm`}
              aria-describedby={errorMessage ? 'username-error' : undefined}
              aria-invalid={!!errorMessage}
            />
            {/* Display error message if present */}
            {errorMessage && (
              <p id="username-error" className="text-red-600 text-sm mt-2">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105 w-full"
          >
            Submit
          </button>
        </form>

        {submittedMessage && (
          <p className="mt-6 text-green-600 text-lg font-semibold">
            {submittedMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
