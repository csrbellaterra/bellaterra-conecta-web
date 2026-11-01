import type { Config } from "tailwindcss";

// Tokens del design system: derivados de la maqueta aprobada — crema
// cálido, blanco roto, oliva oscuro/natural, negro cálido. Nada de
// verdes brillantes ni iconografía "eco" — PLASTY se comunica con la
// misma paleta editorial que el resto del sitio.
const withAlpha = (variable: string) =>
  `color-mix(in srgb, var(${variable}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Con `withAlpha` los modificadores de opacidad (bg-ink/40,
      // from-ink/70, bg-background/95…) funcionan sobre las variables
      // CSS. Con "var(--color-x)" a secas Tailwind no generaba esas
      // clases y velos, degradados y header con scroll fallaban en
      // silencio.
      colors: {
        background: withAlpha("--color-background"),
        surface: withAlpha("--color-surface"),
        text: withAlpha("--color-text"),
        muted: withAlpha("--color-muted"),
        olive: withAlpha("--color-olive"),
        "olive-dark": withAlpha("--color-olive-dark"),
        border: withAlpha("--color-border"),
        ink: withAlpha("--color-ink"),
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
