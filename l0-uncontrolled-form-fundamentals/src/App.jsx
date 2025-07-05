import React, { useRef } from 'react';

// Main App component for the Uncontrolled Form
const App = () => {
  // Requirement: A text input field managed using a ref.
  // Create a ref to directly access the DOM input element.
  const usernameInputRef = useRef(null);

  /**
   * Handles the form submission.
   * @param {Object} e - The event object from the form's onSubmit.
   */
  const handleSubmit = (e) => {
    // Prevent the default browser behavior of refreshing the page on form submission.
    e.preventDefault();

    // Access the input's current value directly from the DOM element via the ref.
    // .current property holds the actual DOM element.
    const enteredUsername = usernameInputRef.current.value;

    // Requirement: A "Submit" button that alerts the entered text upon clicking.
    // Using alert here to strictly follow the problem statement.
    alert(`Submitted Username: ${enteredUsername}`);
    console.log('Submitted Username:', enteredUsername); // Also log to console for debugging

    // Requirement: Ensure that the input is cleared after the submission.
    // Directly manipulate the DOM element to clear its value.
    usernameInputRef.current.value = '';
    // Optionally, focus the input again for convenience
    usernameInputRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Uncontrolled Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="username" className="block text-gray-700 text-lg font-medium mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              ref={usernameInputRef} // Attach the ref to the input element
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg shadow-sm"
              aria-label="Username input"
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg transform hover:scale-105 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
