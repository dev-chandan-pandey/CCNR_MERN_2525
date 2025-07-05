import React, { useState } from 'react';

// Regular expression for basic email validation
// This regex covers common email formats but is not exhaustive for all edge cases.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Main App component for Dynamic Email Form
const App = () => {
  // State to manage the array of email input fields.
  // Each object: { id: string, value: string, error: string | null }
  const [emails, setEmails] = useState([
    { id: crypto.randomUUID(), value: '', error: null } // Start with one empty email field
  ]);

  /**
   * Adds a new empty email input field to the form.
   * Each new field gets a unique ID.
   */
  const handleAddEmailField = () => {
    setEmails((prevEmails) => [
      ...prevEmails,
      { id: crypto.randomUUID(), value: '', error: null } // Add a new email object
    ]);
  };

  /**
   * Handles changes in an individual email input field.
   * Updates the value and performs real-time validation.
   * @param {string} id - The unique ID of the email field being changed.
   * @param {string} newValue - The new value from the input field.
   */
  const handleEmailChange = (id, newValue) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id
          ? {
              ...email,
              value: newValue,
              // Validate in real-time: if not empty and not valid, set error
              error: newValue.trim() !== '' && !EMAIL_REGEX.test(newValue)
                ? 'Invalid email format'
                : null,
            }
          : email
      )
    );
  };

  /**
   * Removes an email input field from the form.
   * @param {string} id - The unique ID of the email field to remove.
   */
  const handleRemoveEmailField = (id) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
  };

  /**
   * Handles the form submission.
   * Logs all valid email addresses to the console.
   * Displays an alert if any email is invalid or empty.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    let allValid = true;
    const submittedEmails = [];

    // Iterate through all email fields to validate and collect values
    const updatedEmailsWithValidation = emails.map((email) => {
      let currentError = null;
      const trimmedValue = email.value.trim();

      if (trimmedValue === '') {
        currentError = 'Email cannot be empty';
        allValid = false;
      } else if (!EMAIL_REGEX.test(trimmedValue)) {
        currentError = 'Invalid email format';
        allValid = false;
      } else {
        submittedEmails.push(trimmedValue); // Collect valid emails
      }
      return { ...email, error: currentError }; // Update error state for display
    });

    setEmails(updatedEmailsWithValidation); // Update state to show validation errors

    if (allValid) {
      alert('All emails are valid! Check console for submitted emails.'); // Using alert as per general instructions
      console.log('Submitted Emails:', submittedEmails);
      // Optionally, clear all fields or reset form after successful submission
      // setEmails([{ id: crypto.randomUUID(), value: '', error: null }]);
    } else {
      alert('Please correct the invalid or empty email fields.'); // Using alert as per general instructions
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Dynamic Email Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {emails.map((email, index) => (
            <div key={email.id} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-grow w-full">
                <input
                  type="email" // Use type="email" for built-in browser validation hints
                  value={email.value}
                  onChange={(e) => handleEmailChange(email.id, e.target.value)}
                  placeholder={`Email ${index + 1}`}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-lg shadow-sm
                    ${email.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
                  `}
                  aria-label={`Email input ${index + 1}`}
                />
                {email.error && (
                  <p className="text-red-600 text-sm mt-1 text-left">{email.error}</p>
                )}
              </div>
              {/* Only show remove button if there's more than one email field */}
              {emails.length > 1 && (
                <button
                  type="button" // Important: type="button" to prevent accidental form submission
                  onClick={() => handleRemoveEmailField(email.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out text-sm"
                  aria-label={`Remove email field ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button" // Important: type="button" to prevent accidental form submission
              onClick={handleAddEmailField}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg flex-grow transform hover:scale-105"
              aria-label="Add new email field"
            >
              Add Email
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out text-lg flex-grow transform hover:scale-105"
              aria-label="Submit form"
            >
              Submit All
            </button>
          </div>
        </form>

        {/* Display all entered email addresses in real time */}
        <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Current Emails:</h2>
          {emails.length === 0 ? (
            <p className="text-gray-500 text-left">No emails entered yet.</p>
          ) : (
            <ul className="space-y-2 text-left">
              {emails.map((email) => (
                <li key={email.id} className={`text-lg ${email.error ? 'text-red-600' : 'text-gray-700'}`}>
                  {email.value || '(Empty)'} {email.error && <span className="text-sm italic">({email.error})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
