/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      /* Every colour resolves through a CSS variable so light/dark is a single
         class swap on <html> rather than a `dark:` variant on every element. */
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        faint: 'rgb(var(--c-faint) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--c-accent-soft) / <alpha-value>)',
        'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
      boxShadow: {
        lift: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.14)',
        hover: '0 2px 4px rgb(0 0 0 / 0.06), 0 18px 40px -12px rgb(0 0 0 / 0.28)',
        inset: 'inset 0 0 0 1px rgb(var(--c-edge) / 0.9)',
      },
      maxWidth: {
        reading: '68ch',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-200px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        rise: 'rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
