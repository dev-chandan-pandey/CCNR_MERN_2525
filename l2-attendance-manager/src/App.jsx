import React, { useState, useMemo } from 'react';

// Main Attendance Manager App component
const App = () => {
  // Requirement: Initialize state with an array of at least 5 student objects.
  // Each student object: { id: number, name: string, present: boolean }
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', present: true },
    { id: 2, name: 'Bob Johnson', present: false },
    { id: 3, name: 'Charlie Brown', present: true },
    { id: 4, name: 'Diana Prince', present: false },
    { id: 5, name: 'Eve Adams', present: true },
    { id: 6, name: 'Frank White', present: false },
  ]);

  // Bonus: State for the filter dropdown ('All', 'Present', 'Absent')
  const [filterStatus, setFilterStatus] = useState('All');

  /**
   * Toggles the attendance status (present/absent) for a student.
   * @param {number} id - The unique ID of the student to toggle.
   */
  const toggleAttendance = (id) => {
    // Follow best practices for immutability and state updates.
    // Map over the students array to create a new array.
    // For the student with the matching ID, create a new object with the toggled 'present' status.
    // For other students, return them as they are.
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  /**
   * Memoized computation for filtered students.
   * This re-runs only when 'students' or 'filterStatus' change.
   * Bonus: Adds a filter dropdown to view "All", "Present", or "Absent" students.
   */
  const filteredStudents = useMemo(() => {
    if (filterStatus === 'Present') {
      return students.filter((student) => student.present);
    } else if (filterStatus === 'Absent') {
      return students.filter((student) => !student.present);
    }
    // 'All' or any other value returns all students
    return students;
  }, [students, filterStatus]);

  /**
   * Calculates the total number of present students.
   * This is a derived state, re-calculated whenever 'students' change.
   */
  const totalPresentStudents = useMemo(() => {
    return students.filter((student) => student.present).length;
  }, [students]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Attendance Manager
        </h1>

        {/* Display total number of present students */}
        <p className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Total Present: <span className="text-purple-600">{totalPresentStudents}</span> / {students.length}
        </p>

        {/* Bonus: Filter dropdown */}
        <div className="mb-6 text-center">
          <label htmlFor="attendanceFilter" className="text-gray-700 font-semibold text-lg mr-3">
            Filter Students:
          </label>
          <select
            id="attendanceFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-white shadow-sm"
            aria-label="Filter students by attendance status"
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Display each student's name and attendance status */}
        <ul className="space-y-4">
          {filteredStudents.length === 0 ? (
            <li className="text-center text-gray-500 text-lg py-4">No students match the current filter.</li>
          ) : (
            filteredStudents.map((student) => (
              <li
                key={student.id} // Use unique ID as key for stable list rendering
                className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition duration-200 ease-in-out
                  ${student.present ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}
                `}
              >
                <div className="flex-grow mr-4">
                  <span className="text-xl font-medium text-gray-800">
                    {student.name}
                  </span>
                  {/* Bonus: Style present students with green and absent students with red. */}
                  <p className={`text-sm mt-1 font-semibold ${
                    student.present ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Status: {student.present ? 'Present' : 'Absent'}
                  </p>
                </div>
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`py-2 px-4 rounded-lg font-semibold text-sm transition duration-200 ease-in-out
                    ${student.present ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  aria-label={`Toggle attendance for ${student.name}`}
                >
                  {student.present ? 'Mark Absent' : 'Mark Present'}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
