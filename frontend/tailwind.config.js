/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        orange: {
          light:   "#F5874A",
          DEFAULT: "#E8621A",
          dark:    "#C94E0E",
        },
        cream: {
          DEFAULT: "#F8F7F4",
          dark:    "#F0EDE8",
        },
        charcoal: {
          DEFAULT: "#1A1A2E",
          light:   "#2D2D44",
          muted:   "#6B6B80",
        },
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #E8621A, #F5874A)",
      },
      animation: {
        fadeUp:  "fadeUp 1s ease forwards",
        fadeIn:  "fadeIn 0.25s ease forwards",
        slideUp: "slideUp 0.35s ease forwards",
      },
      keyframes: {
        fadeUp:  { from: { opacity:0, transform:"translateY(30px)" }, to: { opacity:1, transform:"translateY(0)" } },
        fadeIn:  { from: { opacity:0 }, to: { opacity:1 } },
        slideUp: { from: { opacity:0, transform:"translateY(24px)" }, to: { opacity:1, transform:"translateY(0)" } },
      },
      boxShadow: {
        card:   "0 2px 20px rgba(26,26,46,0.08)",
        "card-hover": "0 8px 40px rgba(26,26,46,0.14)",
        orange: "0 8px 32px rgba(232,98,26,0.25)",
      },
    },
  },
  plugins: [],
};
