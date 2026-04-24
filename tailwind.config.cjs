/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#D85A30',
          50: '#FDF2EE',
          100: '#F9E5DD',
          500: '#D85A30',
          600: '#B84A26',
        },
        teal: {
          DEFAULT: '#1D9E75',
          50: '#E8F7F2',
          100: '#D1EFE5',
          500: '#1D9E75',
          600: '#18825F',
        },
        cream: {
          DEFAULT: '#FAEEDA',
          50: '#FFF8F1',
          100: '#FAEEDA',
        },
        brown: {
          DEFAULT: '#4A1B0C',
          500: '#4A1B0C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}