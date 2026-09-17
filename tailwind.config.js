/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2346e1',
          dark: '#5b7cfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 20px 50px rgba(30, 41, 59, 0.12)',
        'panel-dark': '0 20px 50px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
