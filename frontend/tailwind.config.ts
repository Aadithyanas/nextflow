import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#07111f",
        mist: "#edf3fb",
        line: "rgba(148, 163, 184, 0.18)",
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#badaff",
          300: "#8fc4ff",
          400: "#60a9fb",
          500: "#3f88f4",
          600: "#2467d6",
          700: "#1d53ae",
          800: "#1d488f",
          900: "#1e3d74",
        },
        // Per-node-type accent colors
        node: {
          trigger: "#10b981",
          "trigger-light": "#d1fae5",
          ai: "#3f88f4",
          "ai-light": "#dbeafe",
          api: "#f59e0b",
          "api-light": "#fef3c7",
          state: "#a855f7",
          "state-light": "#f3e8ff",
          output: "#64748b",
          "output-light": "#f1f5f9",
        },
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.12)",
        "glow-sm": "0 8px 32px rgba(15, 23, 42, 0.10)",
        "node-trigger": "0 0 0 1px rgba(16, 185, 129, 0.3), 0 4px 20px rgba(16, 185, 129, 0.15)",
        "node-ai": "0 0 0 1px rgba(63, 136, 244, 0.3), 0 4px 20px rgba(63, 136, 244, 0.15)",
        "node-api": "0 0 0 1px rgba(245, 158, 11, 0.3), 0 4px 20px rgba(245, 158, 11, 0.15)",
        "node-state": "0 0 0 1px rgba(168, 85, 247, 0.3), 0 4px 20px rgba(168, 85, 247, 0.15)",
        "node-output": "0 0 0 1px rgba(100, 116, 139, 0.3), 0 4px 20px rgba(100, 116, 139, 0.12)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(63,136,244,0.14), transparent 36%), radial-gradient(circle at top right, rgba(20,184,166,0.10), transparent 30%), radial-gradient(circle at bottom center, rgba(168,85,247,0.07), transparent 40%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%)",
        "auth-hero": "radial-gradient(circle at top left, rgba(96,165,250,0.32), transparent 38%), radial-gradient(circle at bottom right, rgba(45,212,191,0.26), transparent 34%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
