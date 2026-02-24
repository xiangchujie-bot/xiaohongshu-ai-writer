/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'xiaohongshu': {
          red: '#FF2442',
          orange: '#FF6B35',
          pink: '#FF8FA3',
          light: '#FFF0F5',
        }
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
}
