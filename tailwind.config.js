/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'fyw-',
  important: '.fyw-widget',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'fyw-black': '#000000',
        'fyw-white': '#ffffff',
        'fyw-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      spacing: {
        'fyw-xs': '0.5rem',
        'fyw-sm': '1rem',
        'fyw-md': '1.5rem',
        'fyw-lg': '2rem',
        'fyw-xl': '3rem',
      },
      fontFamily: {
        // Custom fonts for FYW widget
        'heading': ['Bebas Neue', 'Arial', 'sans-serif'],
        'sans': ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


