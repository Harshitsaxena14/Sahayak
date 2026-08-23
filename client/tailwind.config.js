/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sahayak: {
          canvas: '#FBF7F1',
          surface: '#FFFFFF',
          surfaceWarm: '#FDF3E7',
          surfaceViolet: '#F1EEFC',
          ink: '#1E1B29',
          inkSoft: '#6B667A',
          inkMuted: '#9C97AC',
          border: '#EAE3D8',
          primary: '#D96A2B',
          primaryHover: '#C15A20',
          intelligence: '#6D5BD0',
          intelligenceSoft: '#A99BEB',
          success: '#1F9D6B',
          successBg: '#ECFBF4',
          warning: '#C7821A',
          warningBg: '#FDF3E2',
          error: '#C6473D',
          errorBg: '#FCEEEC',
          info: '#2C7A9C',
          infoBg: '#EAF4F8',
        }
      },
      spacing: {
        touch: '2.75rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Devanagari', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sahayak-card': '0 4px 20px -2px rgba(30, 27, 41, 0.05), 0 2px 6px -1px rgba(30, 27, 41, 0.03)',
        'sahayak-hover': '0 12px 28px -4px rgba(30, 27, 41, 0.09), 0 4px 10px -2px rgba(30, 27, 41, 0.04)',
        'sahayak-float': '0 10px 30px -5px rgba(217, 106, 43, 0.3)',
        'orb-glow': '0 0 35px -5px rgba(109, 91, 208, 0.35)',
        'civic': '0 4px 20px -2px rgba(30, 27, 41, 0.05)',
        'civic-hover': '0 12px 28px -4px rgba(30, 27, 41, 0.09)'
      }
    },
  },
  plugins: [],
}
