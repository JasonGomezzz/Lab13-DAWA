import type { CSSProperties } from "react";

type Variant = "solid" | "outline" | "accent";

/**
 * Una línea de texto cuyas letras suben una a una (CSS puro, sin JS).
 * El texto real va en un span solo para lectores de pantalla.
 */
export default function KineticLine({
  text,
  variant = "solid",
  delay = 0,
}: {
  text: string;
  variant?: Variant;
  delay?: number;
}) {
  return (
    <span className={`k-line ${variant !== "solid" ? `k-${variant}` : ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((char, i) => (
          <span
            key={i}
            className="k-char"
            style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}
          >
            <span className="k-glyph">{char === " " ? " " : char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
