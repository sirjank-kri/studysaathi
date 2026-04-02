/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#1a1a2e',
          900: '#0f0f23',
        },
        primary: {
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#667eea',
          600: '#5b21b6',
        },
        accent: {
          purple: '#764ba2',
          cyan: '#4facfe',
          pink: '#f093fb',
          green: '#43e97b',
        },
      },
    },
  },
  plugins: [],
}