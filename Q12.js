function createCounter() {
  let count = 0; // This 'count' is private to the closure

  return {
    increment: function() {
      count++;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

// Create a new counter instance
const myCounter = createCounter();

// Interact with the counter using its public methods
// console.log(myCounter.increment()); // Output: 1
// console.log(myCounter.increment()); // Output: 2
// console.log(myCounter.getCount());  // Output: 2

// Attempting to access myCounter.count directly will result in undefined or an error
// console.log(myCounter.count); // This will NOT work!
        