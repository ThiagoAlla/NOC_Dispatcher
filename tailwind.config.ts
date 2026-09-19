import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noc: {
          bg: '#080C10',
          bgAlt: '#0B1015',
          surface: '#101720',
          surface2: '#16202C',
          surface3: '#1D2A3A',
          border: '#223042',
          borderLight: '#2C3E55',
          text: '#EEF4FA',
          textDim: '#96A4B8',
          textFaint: '#607086',
          textDark: '#041814',
          signal: '#35D1B8',
          signalHover: '#42E3CA',
          signalDim: 'rgba(53, 209, 184, 0.12)',
          signalGlow: 'rgba(53, 209, 184, 0.25)',
          amber: '#F0A742',
          amberHover: '#F9B75B',
          amberDim: 'rgba(240, 167, 66, 0.12)',
          red: '#EF5B5B',
          redHover: '#F76F6F',
          redDim: 'rgba(239, 91, 91, 0.12)',
          purple: '#A78BFA',
          purpleDim: 'rgba(167, 139, 250, 0.12)',
        },
      },
      boxShadow: {
        'noc-glow': '0 0 25px -5px rgba(53, 209, 184, 0.25)',
        'noc-red-glow': '0 0 25px -5px rgba(239, 91, 91, 0.3)',
        'noc-amber-glow': '0 0 25px -5px rgba(240, 167, 66, 0.25)',
        'noc-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'noc-card-hover': '0 14px 40px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(53, 209, 184, 0.2)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Inter"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
