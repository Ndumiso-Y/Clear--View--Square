
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {"dark": "#1C1C1C", "mid": "#4C4C4C", "light": "#A6A6A6", "accent": "#4A3B2A", "bg": "#F8F8F8"}
      },
      fontFamily: { sans:["Inter","system-ui","Segoe UI","Roboto","Helvetica","Arial","sans-serif"] }
    }
  },
  plugins: []
}
