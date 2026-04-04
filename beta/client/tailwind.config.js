/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0b1220',
          800: '#1e293b',
          600: '#475569',
        },
        surface: '#f8fafc',
      },
    },
  },
  plugins: [],
};
