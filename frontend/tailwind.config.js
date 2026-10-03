/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#486581',
          600: '#334e68',
          700: '#243b53',
          800: '#102a43',
          900: '#0b192c',
          950: '#07101e',
        },
        civic: {
          teal: '#0d9488',
          tealHover: '#0f766e',
          tealLight: '#f0fdfa',
          tealBorder: '#99f6e4',
          navy: '#0f172a',
          navyLight: '#1e293b',
          surface: '#ffffff',
          bg: '#f8fafc',
          border: '#e2e8f0',
          muted: '#64748b',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'float': '0 20px 30px -10px rgba(15, 23, 42, 0.12), 0 8px 12px -4px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
