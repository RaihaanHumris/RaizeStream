import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B0B14",
        "deep-navy": "#14142A",
        "slate-night": "#1C1C38",
        outline: "#2A2A4A",
        "electric-purple": "#8B5CF6",
        "neon-pink": "#FF3D6E",
        "soft-gray": "#A1A1B5",
        muted: "#6B6B80",
        "brand-green": "#22C55E",
        "brand-amber": "#FBBF24",
        "brand-red": "#EF4444",
        "footer-bg": "#07070F",
      },
      fontFamily: {
        outfit: ["Outfit", "system-ui", "-apple-system", "sans-serif"],
        poppins: ["Poppins", "system-ui", "-apple-system", "sans-serif"],
        inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0, 0, 0, 0.4)",
        "glow-purple": "0 0 24px rgba(139, 92, 246, 0.45)",
        "glow-pink": "0 0 24px rgba(255, 61, 110, 0.45)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #8B5CF6 0%, #FF3D6E 100%)",
        "hero-overlay": "linear-gradient(to top, #0B0B14 0%, transparent 70%)",
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
