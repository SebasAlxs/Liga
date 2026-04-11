import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'obsidian-950': '#020617',
        'obsidian-900': '#0f172a',
        'obsidian-800': '#1e293b',
        'emerald': {
          '50': '#ecfdf5',
          '100': '#d1fae5',
          '200': '#a7f3d0',
          '300': '#6ee7b7',
          '400': '#34d399',
          '500': '#10b981',
          '600': '#059669',
          '700': '#047857',
          '800': '#065f46',
          '900': '#064e3b',
          '950': '#022c22',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.2, 0, 0, 1) forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
}
