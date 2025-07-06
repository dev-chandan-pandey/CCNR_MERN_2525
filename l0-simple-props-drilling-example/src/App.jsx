import React, { useState } from 'react';

// Deeply Nested Child Component: BottomMainRight
// This component receives the 'username' prop from its parent (MiddleComponent).
const BottomMainRight = ({ username }) => {
  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow-inner border border-blue-200 text-center">
      <h4 className="text-lg font-semibold text-blue-800 mb-2">BottomMainRight Component</h4>
      <p className="text-xl font-bold text-blue-900">
        User Name Displayed: <span className="text-purple-700">{username || 'N/A'}</span>
      </p>
      <p className="text-sm text-gray-600 mt-2">
        (This component directly uses the 'username' prop)
      </p>
    </div>
  );
};

// Intermediate Child Component: MiddleComponent
// This component receives the 'username' prop from its parent (App).
// It doesn't directly use 'username' but passes it down to BottomMainRight.
const MiddleComponent = ({ username }) => {
  return (
    <div className="p-6 bg-green-100 rounded-xl shadow-md border border-green-200 w-full mb-6">
      <h3 className="text-xl font-bold text-green-800 mb-4 text-center">MiddleComponent</h3>
      <p className="text-gray-700 mb-4 text-center">
        (This component receives 'username' but just passes it down)
      </p>
      {/* Props Drilling: Passing 'username' down to BottomMainRight */}
      <BottomMainRight username={username} />
    </div>
  );
};

// Parent Component: App
// Manages the 'username' state and initiates the props drilling.
const App = () => {
  // State to store the user's name.
  const [username, setUsername] = useState('');

  /**
   * Handles changes to the input field, updating the username state.
   * @param {Object} e - The event object from the input's onChange.
   */
  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Props Drilling Example
        </h1>

        <div className="mb-8">
          <label htmlFor="nameInput" className="block text-gray-700 text-lg font-medium mb-2 text-left">
            Enter Your Name:
          </label>
          <input
            type="text"
            id="nameInput"
            value={username}
            onChange={handleNameChange}
            placeholder="Type your name here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm"
            aria-label="User name input"
          />
        </div>

        <p className="text-gray-800 text-xl font-semibold mb-6">
          Data Flow: App (Parent) &#8594; MiddleComponent &#8599; BottomMainRight (Nested Child)
        </p>

        {/* Props Drilling: Passing 'username' from App to MiddleComponent */}
        <MiddleComponent username={username} />
      </div>
    </div>
  );
};

export default App;
