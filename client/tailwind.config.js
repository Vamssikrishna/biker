/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        brand: "#7c3aed",
        mint: "#2dd4bf",
        amber: "#f59e0b"
      },
      boxShadow: {
        glow: "0 0 60px rgba(124, 58, 237, 0.28)"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
