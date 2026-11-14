import type { ReactNode } from "react";
import KineticLine from "./KineticLine";
import Marquee from "./Marquee";

type Line = { text: string; variant?: "solid" | "outline" | "accent" };

/** Pantalla dividida: tipografía cinética a la izquierda, formulario a la derecha. */
export default function AuthShell({
  tag,
  lines,
  children,
}: {
  tag: string;
  lines: Line[];
  children: ReactNode;
}) {
  return (
    <main className="grid flex-1 lg:grid-cols-[1.2fr_1fr]">
      <section className="k-panel relative flex min-h-[22rem] flex-col justify-between overflow-hidden border-b border-line py-8 lg:border-r lg:border-b-0">
        <div className="k-grid-bg absolute inset-0" aria-hidden />

        <div className="relative flex items-center gap-3 px-6 font-mono text-xs tracking-[0.16em] text-muted uppercase sm:px-10">
          <span className="k-dot size-2 rounded-full bg-white" />
          {tag}
        </div>

        <h1 className="k-display relative px-6 py-8 sm:px-10">
          {lines.map((line, i) => (
            <KineticLine
              key={line.text}
              text={line.text}
              variant={line.variant}
              delay={i * 180}
            />
          ))}
        </h1>

        <div className="relative -rotate-2 scale-105" aria-hidden>
          <Marquee
            items={["Google", "GitHub", "Credenciales", "bcrypt", "JWT"]}
            variant="solid"
            speed={26}
          />
          <Marquee
            items={["OAuth 2.0", "NextAuth", "Sesión segura", "Next.js 16"]}
            variant="line"
            reverse
            speed={34}
          />
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}
