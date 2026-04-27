/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f0',
          100: '#ffccc7',
          200: '#ffa39e',
          300: '#ff7875',
          400: '#ff4d4f', // Main Red
          500: '#ff4d4f', // Primary Red
          600: '#d9363e',
          700: '#b02531',
          800: '#8c1a24',
          900: '#661019',
          950: '#450a0a',
        },
        surface: {
          50: '#09090b',  // Dark Mode Base
          100: '#18181b', // Card Background
          200: '#27272a', // Border
          300: '#3f3f46',
          400: '#52525b',
          500: '#71717a',
          600: '#a1a1aa',
          700: '#d4d4d8',
          800: '#e4e4e7',
          900: '#e4e4e7', // Main Text
          950: '#d4d4d8',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 0 40px -10px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 0 60px -15px rgba(255, 77, 79, 0.05)',
        'brand': '0 20px 30px -10px rgba(255, 77, 79, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    }
  },
  plugins: []
};
