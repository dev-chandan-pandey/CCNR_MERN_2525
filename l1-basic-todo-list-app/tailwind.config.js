/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind where to find your React components to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all JS, TS, JSX, TSX files in the src folder
  ],
  theme: {
    extend: {}, // This is where you can add custom Tailwind configurations
  },
  plugins: [], // This is where you can add Tailwind plugins
}