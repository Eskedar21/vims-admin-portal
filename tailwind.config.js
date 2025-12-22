/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#88bf47',
          dark: '#0fa84a',
          hover: '#6fa038',
        },
        secondary: {
          DEFAULT: '#1d8dcc',
          dark: '#1570a0',
          hover: '#1a7bb3',
        },
        accent: {
          DEFAULT: '#0fa84a',
          dark: '#0d8a3d',
        },
      },
    },
  },
  plugins: [],
};

