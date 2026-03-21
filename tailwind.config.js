/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfd8ff",
          300: "#93bbff",
          400: "#5f97ff",
          500: "#2563ff",
          600: "#1d4ed8",
          700: "#1d42af",
          800: "#1d3a8a",
          900: "#1c336d"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        lift: "0 28px 80px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};
