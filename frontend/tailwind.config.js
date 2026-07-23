/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf9fe',
          100: '#f4f0fd',
          200: '#e9e1fa',
          300: '#d7c7f7',
          400: '#bca1f2',
          500: '#9f7aea', // Refined Purple Brand
          600: '#805ad5',
          700: '#6b46c1',
          800: '#553c9a',
          900: '#44337a',
          950: '#2b1d52',
        },
        // We ensure a sleek neutral slate and charcoal palette for Vercel/Linear dark aesthetics
        neutral: {
          850: '#202023',
          950: '#09090b', // Deep charcoal/black
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'focus-ring': '0 0 0 2px rgba(128, 90, 213, 0.15)',
      },
      borderRadius: {
        'lg': '8px',
        'md': '6px',
        'sm': '4px',
      }
    },
  },
  plugins: [],
}
