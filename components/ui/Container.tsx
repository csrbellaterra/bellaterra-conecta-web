import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contenedor de ancho máximo compartido por todas las secciones
 * (maxWidth.content = 1360px, definido en tailwind.config.ts).
 */
export default function Container({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article";
}) {
  return (
    <As className={cn("mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </As>
  );
}
