/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      colors: {
        brand: {
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#AA820A',
          emerald: '#0B2019',
          emeraldDeep: '#061410',
          sand: '#F7F4EE',
          sandLight: '#FAF8F5',
          sandDark: '#EBE5D8',
        }
      },
    },
  },
  plugins: [],
}
