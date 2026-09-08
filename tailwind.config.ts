import type { Config } from "tailwindcss";

// Tokens del design system: derivados de la maqueta aprobada — crema
// cálido, blanco roto, oliva oscuro/natural, negro cálido. Nada de
// verdes brillantes ni iconografía "eco" — PLASTY se comunica con la
// misma paleta editorial que el resto del sitio.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        olive: "var(--color-olive)",
        "olive-dark": "var(--color-olive-dark)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      maxWidth: {
        content: "1360px",
      },
    },
  },
  plugins: [],
};

export default config;
