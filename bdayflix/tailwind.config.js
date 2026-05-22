/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'bg-dark': '#0f0f0f',
      },
    },
  },
  plugins: [],
}
