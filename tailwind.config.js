/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {}
  },
  plugins: [],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    textColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
    extend: {}
  }
}
