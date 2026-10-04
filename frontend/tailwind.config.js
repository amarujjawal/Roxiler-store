/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020817',
        },
        accent: {
          teal: '#2DD4BF',
          purple: '#A78BFA',
          emerald: '#34D399',
        },
      },
      boxShadow: {
        glass: '0 20px 45px rgba(15, 23, 42, 0.35)',
        glow: '0 0 0 1px rgba(45, 212, 191, 0.35), 0 8px 30px rgba(45, 212, 191, 0.18)',
      },
      backgroundImage: {
        'radial-hero': 'radial-gradient(circle at top left, rgba(20,184,166,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(139,92,246,0.18), transparent 35%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
