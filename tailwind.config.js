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
          50: "#E6F0FF",
          100: "#B3D4FF",
          200: "#4C9AFF",
          300: "#2684FF",
          400: "#0065FF",
          500: "#0052CC",
          600: "#0747A6",
          700: "#003884",
          800: "#002B63",
          900: "#001D42"
        },
        jira: {
          bg: "#F4F5F7",
          sidebar: "#0052CC",
          "sidebar-dark": "#1D2125",
          card: "#FFFFFF",
          border: "#DFE1E6",
          "text-primary": "#172B4D",
          "text-secondary": "#6B778C",
          success: "#36B37E",
          warning: "#FF8B00",
          danger: "#DE350B",
          "success-bg": "#E3FCEF",
          "warning-bg": "#FFFAE6",
          "danger-bg": "#FFEBE6",
          hover: "#EBECF0"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        sm: "0 1px 2px rgba(9, 30, 66, 0.08)",
        card: "0 1px 3px rgba(9, 30, 66, 0.13)",
        md: "0 4px 8px rgba(9, 30, 66, 0.08), 0 0 1px rgba(9, 30, 66, 0.12)",
        lg: "0 8px 16px rgba(9, 30, 66, 0.08), 0 0 1px rgba(9, 30, 66, 0.12)",
        overlay: "0 12px 24px rgba(9, 30, 66, 0.15), 0 0 1px rgba(9, 30, 66, 0.2)"
      },
      spacing: {
        sidebar: "240px",
        topbar: "56px"
      }
    }
  },
  plugins: []
};
