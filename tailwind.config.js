/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#20BDAA',
          dark: '#1AA192',
          light: '#E6F7F5',
        },
        secondary: {
          DEFAULT: '#0A2540',
          light: '#1E3A5F',
        },
        gray: {
          100: '#F8FAFB',
          200: '#EAEEF2',
          300: '#D1D9E2',
          400: '#A3B0C2',
          500: '#5F6C7B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.12)',
        glow: '0 0 20px rgba(32, 189, 170, 0.4)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};