import path from 'node:path'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          DEFAULT: '#081522',
          header: '#0b1c30',
          sidebar: '#0a1929',
          panel: 'rgba(10, 28, 48, 0.92)',
          card: '#12304f',
          cardHover: '#174066',
          border: '#1e3a5f',
          borderSoft: '#163050',
          active: '#1a4a7a',
          input: '#0e243c',
        },
        ink: {
          primary: '#e8f1fb',
          secondary: '#8ba3c0',
          muted: '#5c7a99',
          inverse: '#081522',
        },
        accent: {
          cyan: '#2fd4e8',
          blue: '#3b82f6',
          glow: '#00d4ff',
        },
        status: {
          online: '#22c55e',
          offline: '#6b7c93',
          warn: '#f59e0b',
          danger: '#ef4444',
          info: '#38bdf8',
        },
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Microsoft YaHei',
          'Noto Sans SC',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Consolas', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        panel: '10px',
        card: '8px',
      },
      boxShadow: {
        panel: '0 8px 32px rgba(0, 0, 0, 0.45)',
        card: '0 2px 8px rgba(0, 0, 0, 0.25)',
        glow: '0 0 12px rgba(47, 212, 232, 0.45)',
      },
    },
  },
  plugins: [],
}
