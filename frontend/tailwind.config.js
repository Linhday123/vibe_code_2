/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-dark": "#3730A3",
        "primary-light": "#EEF2FF",
        accent: "#7C3AED",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        background: "#F8FAFC",
        "text-primary": "#1E293B",
        "text-muted": "#64748B"
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)"
      }
    }
  },
  plugins: []
};
