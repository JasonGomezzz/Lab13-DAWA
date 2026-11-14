import type { CSSProperties } from "react";

/** Franja de texto que corre sin fin. Dos pistas idénticas = bucle sin saltos. */
export default function Marquee({
  items,
  variant = "line",
  reverse = false,
  speed = 30,
  className = "",
}: {
  items: string[];
  variant?: "line" | "solid";
  reverse?: boolean;
  speed?: number;
  className?: string;
}) {
  const track = (
    <div className="k-track" aria-hidden>
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-8 px-4 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
        >
          {item}
          <span className="text-[0.7em]">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`k-marquee py-3 k-strip-${variant} ${className}`}
      data-reverse={reverse || undefined}
      style={{ "--speed": `${speed}s` } as CSSProperties}
    >
      {track}
      {track}
    </div>
  );
}
