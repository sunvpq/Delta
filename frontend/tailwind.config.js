/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0d1117',
        card: '#161b22',
        'card-hover': '#1c2128',
        border: '#30363d',
        'off-white': '#e6edf3',
        muted: '#8b949e',
        teal: {
          DEFAULT: '#00b4d8',
          dim: '#0090ad',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
