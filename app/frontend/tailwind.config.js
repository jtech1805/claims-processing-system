/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        surface: {
          base: '#07090f',
          DEFAULT: '#0d1117',
          raised: '#111827',
          overlay: '#161f2e',
          border: '#1e2d42',
          'border-subtle': '#162032',
        },
        accent: {
          DEFAULT: '#14b8a6',
          muted: '#0d7a70',
          glow: 'rgba(20,184,166,0.15)',
        },
        status: {
          approved: '#22c55e',
          'approved-bg': 'rgba(34,197,94,0.1)',
          partial: '#f59e0b',
          'partial-bg': 'rgba(245,158,11,0.1)',
          rejected: '#ef4444',
          'rejected-bg': 'rgba(239,68,68,0.1)',
        },
      },
      keyframes: {
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-in': {
          from: { transform: 'translateY(100%) scale(0.95)', opacity: '0' },
          to: { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.16,1,0.3,1)',
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
