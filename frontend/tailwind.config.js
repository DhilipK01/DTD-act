/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          950: '#070a12',
          900: '#0b0f19',
          850: '#101626',
          800: '#161f33',
          750: '#1d2942',
          700: '#253454',
        },
        surface: {
          950: 'var(--surface-950, #070a12)',
          900: 'var(--surface-900, #0b0f19)',
          850: 'var(--surface-850, #101626)',
          800: 'var(--surface-800, #161f33)',
          750: 'var(--surface-750, #1d2942)',
          700: 'var(--surface-700, #253454)',
        },
        yt: {
          red: '#ff0000',
          'red-hover': '#cc0000',
          'red-light': '#ff4d4d',
          'red-subtle': '#fef2f2',
          'red-subtle-dark': 'rgba(255, 0, 0, 0.12)',
          bg: 'var(--yt-bg, #f9f9f9)',
          card: 'var(--yt-card, #ffffff)',
          border: 'var(--yt-border, #e5e5e5)',
          chip: 'var(--yt-chip, #f2f2f2)',
          'chip-hover': 'var(--yt-chip-hover, #e5e5e5)',
          text: 'var(--yt-text, #0f0f0f)',
          subtext: 'var(--yt-subtext, #606060)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        'yt-card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'yt-card-hover': '0 4px 16px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 25px -4px rgba(255, 0, 0, 0.35)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.35)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -4px rgba(244, 63, 94, 0.35)',
        'glass-card': '0 20px 40px -15px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-card-hover': '0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 24px -6px rgba(16, 185, 129, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
