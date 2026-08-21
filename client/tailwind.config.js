/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0F172A',
          primary: '#1E3A8A',
          primaryHover: '#1E40AF',
          accent: '#D97706',
          accentDark: '#C2410C',
          bg: '#FDFBF7',
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtle: '#64748B'
        },
        status: {
          eligible: '#059669',
          infoNeeded: '#D97706',
          notEligible: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'sans-serif'],
      },
      minHeight: {
        'touch': '44px'
      },
      minWidth: {
        'touch': '44px'
      }
    },
  },
  plugins: [],
}
