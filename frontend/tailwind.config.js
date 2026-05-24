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
          blue: "#1E60FF",
          gold: "#d4af37",
          pink: "#E91E63",
          bg: "#050505",
          card: "#0A0A0A"
        }
      }
    },
  },
  plugins: [],
}
