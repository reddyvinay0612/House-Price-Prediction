/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb8ff',
          400: '#5891ff',
          500: '#2f6bff',
          600: '#154aff',
          700: '#0b3d91', // Official Government Navy Primary
          800: '#082f70',
          900: '#062456',
          950: '#031433',
        },
        saffron: {
          DEFAULT: '#ff9933', // India Saffron (National Tricolour Accent)
          light: '#ffb366',
          dark: '#e67300',
        },
        indiagreen: {
          DEFAULT: '#138808', // India Green (National Tricolour Primary Action)
          light: '#1ea60c',
          dark: '#0e5f05',
        },
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        govgreen: {
          DEFAULT: '#138808',
          light: '#22c55e',
          dark: '#0e6406',
        },
        govred: {
          DEFAULT: '#b91c1c',
          light: '#ef4444',
          dark: '#991b1b',
        },
        govgrey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        },
        govtext: {
          DEFAULT: '#1f293b',
          muted: '#4b5563',
          light: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Devanagari"', 'Roboto', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        'sm': '2px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
