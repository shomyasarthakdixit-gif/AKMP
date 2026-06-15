/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover:      "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: { DEFAULT: "hsl(var(--success))" },
        warning: { DEFAULT: "hsl(var(--warning))" },

        /* === Aurora / Nebula custom tokens === */
        aurora: {
          primary:   "#5B4BFF",
          secondary: "#00BFA6",
          accent:    "#FF7A59",
        },
        nebula: {
          primary:   "#8B7CFF",
          secondary: "#2DD4BF",
          accent:    "#FF8A65",
          bg:        "#070B14",
          surface:   "#111827",
          card:      "#161F2E",
        },
      },
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xl:  "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        access:  ["Atkinson Hyperlegible", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        /* Slide in from left (hero heading) */
        slideInLeft: {
          "0%":   { opacity: "0", transform: "translateX(-60px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        /* Fade up (stagger) */
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        /* Fade in */
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        /* Float gentle */
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-20px) scale(1.05)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        floatFast: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-8px) rotate(3deg)" },
        },
        /* Gradient mesh pulse */
        gradientShift: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        /* Glow pulse on buttons */
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(91,75,255,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(91,75,255,0.6)" },
        },
        /* Shimmer (skeleton) */
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        /* Spin for loaders */
        spin: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        /* Accordion open/close */
        accordionDown: {
          from: { height: "0", opacity: "0" },
          to:   { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        accordionUp: {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to:   { height: "0", opacity: "0" },
        },
        /* Page enter */
        pageEnter: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        /* Shine sweep */
        shine: {
          from: { left: "-100%" },
          to:   { left: "200%" },
        },
        /* Bounce gentle */
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        /* Ripple */
        ripple: {
          "0%":   { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        /* Counter number tick */
        numberTick: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-left":   "slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-up":         "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":         "fadeIn 0.5s ease forwards",
        "float-slow":      "floatSlow 8s ease-in-out infinite",
        "float-medium":    "floatMedium 5s ease-in-out infinite",
        "float-fast":      "floatFast 3.5s ease-in-out infinite",
        "gradient-shift":  "gradientShift 6s ease infinite",
        "glow-pulse":      "glowPulse 2s ease-in-out infinite",
        "shimmer":         "shimmer 1.8s linear infinite",
        "page-enter":      "pageEnter 0.4s ease forwards",
        "shine":           "shine 0.6s ease forwards",
        "bounce-soft":     "bounceSoft 2s ease-in-out infinite",
        "accordion-down":  "accordionDown 0.2s ease-out",
        "accordion-up":    "accordionUp 0.2s ease-out",
      },
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
      },
      boxShadow: {
        "glow-primary": "0 0 24px rgba(91,75,255,0.35)",
        "glow-teal":    "0 0 24px rgba(0,191,166,0.35)",
        "glow-coral":   "0 0 24px rgba(255,122,89,0.35)",
        "card-premium": "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        "card-hover":   "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        "sidebar":      "4px 0 24px rgba(0,0,0,0.08)",
        "navbar":       "0 2px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
