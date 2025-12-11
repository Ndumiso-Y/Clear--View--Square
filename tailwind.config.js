
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "dark": "#1C1C1C",
          "mid": "#4C4C4C",
          "light": "#A6A6A6",
          "accent": "#111111",
          "accentStrong": "#000000",
          "accentSoft": "#EDEDED",
          "bg": "#F8F8F8"
        }
      },
      fontFamily: { sans:["Inter","system-ui","Segoe UI","Roboto","Helvetica","Arial","sans-serif"] },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)'
          }
        },
        shimmer: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 20px 8px rgba(255, 255, 255, 0.2)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)'
          }
        },
        beam: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        'pulse-gentle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'beam': 'beam 2s linear infinite'
      }
    }
  },
  plugins: []
}
