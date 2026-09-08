/**
 * Combina clases condicionales sin depender de clsx/tailwind-merge
 * (evitamos añadir dependencias no listadas en package.json).
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
