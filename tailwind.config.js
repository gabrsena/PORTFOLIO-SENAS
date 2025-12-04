/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        anton: ['"Anton"', 'sans-serif'],
        'field-gothic': ['"Oswald"', 'sans-serif'],
      },
      colors: {
        nobel: {
          gold: '#B91C1C',
          dark: '#1a1a1a',
          cream: '#F9F8F4',
        }
      }
    },
  },
  plugins: [],
}
