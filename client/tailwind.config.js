/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stitch: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          text: '#0F172A',
          subtle: '#64748B',
          muted: '#94A3B8',
          border: '#E5E7EB',
          accent: '#FF8A00',
          accentHover: '#E67C00',
          saffron: '#F97316',
          lavender: '#8B5CF6',
          lavenderTint: '#E0E7FF',
          success: '#10B981',
          successBg: '#ECFDF5',
          chip: '#F3F4F6',
          matchBg: '#FFF7ED',
          matchBorder: '#FDBA74',
          navy: '#0F172A',
          navyLight: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'stitch-card': '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'stitch-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        'stitch-float': '0 10px 30px -5px rgba(255, 138, 0, 0.3)',
        'orb-glow': '0 0 35px -5px rgba(139, 92, 246, 0.35)'
      }
    },
  },
  plugins: [],
}
