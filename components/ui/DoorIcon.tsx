import type { DoorIconName } from "@/types/content";

/**
 * Iconos de línea muy simples, dibujados a mano (sin librería de
 * iconos genérica) para las 5 puertas. Deliberadamente minimalistas
 * — un solo trazo fino, sin relleno — para no introducir la estética
 * "SaaS" que pide evitar el prompt de rediseño.
 */
export default function DoorIcon({ name, className }: { name: DoorIconName; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "briefcase":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
          <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
          <path d="M3 12.5h18" />
        </svg>
      );
    case "party":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 20 14.5 6.5" />
          <path d="M6 9.5a2 2 0 1 0 3-3" />
          <path d="M12 6.5a1.5 1.5 0 1 0 2.25-2.25" />
          <path d="M15 13a1.5 1.5 0 1 0 2.25-2.25" />
          <circle cx="18.5" cy="17.5" r="1.1" />
          <circle cx="8" cy="18.5" r="0.9" />
        </svg>
      );
    case "bed":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 19v-8.5A1.5 1.5 0 0 1 4.5 9H11" />
          <path d="M3 15h18v4" />
          <path d="M11 15V9h8.5A1.5 1.5 0 0 1 21 10.5V15" />
          <circle cx="6.5" cy="12" r="1.1" />
        </svg>
      );
    case "community":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="9" cy="9.5" r="3" />
          <circle cx="16" cy="10.5" r="2.4" />
          <path d="M3.5 19c.6-2.9 2.7-4.5 5.5-4.5s4.9 1.6 5.5 4.5" />
          <path d="M15 14.7c2.2.2 3.8 1.6 4.5 4.3" />
        </svg>
      );
    case "pickleball":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="9.5" cy="9.5" r="5.5" />
          <circle cx="7.5" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="12" cy="10" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
          <path d="M13.5 13.5 20 20" />
        </svg>
      );
    default:
      return null;
  }
}
