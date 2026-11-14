import { connection } from "next/server";
import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import KineticLine from "@/components/kinetic/KineticLine";
import Marquee from "@/components/kinetic/Marquee";

const PROVIDERS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  credentials: "Correo y contraseña",
};

async function DashboardContent() {
  // Sesión leída por petición: evita el prerender de valores aleatorios (csrf).
  await connection();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const { user } = session;
  const firstName = (user.name ?? "usuario").split(" ")[0];
  const provider = PROVIDERS[session.provider ?? ""] ?? "Desconocido";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-12 px-6 pt-12 sm:px-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
          Dashboard / Sesión activa
        </p>
        <h1 className="k-display-md">
          <KineticLine text="Hola," />
          <KineticLine text={`${firstName}.`} variant="accent" delay={140} />
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Nombre", user.name ?? "—"],
          ["Correo", user.email ?? "—"],
          ["Proveedor", provider],
        ].map(([label, value], i) => (
          <div
            key={label}
            className="k-card k-in"
            style={{ "--i": i + 2 } as React.CSSProperties}
          >
            <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-semibold break-all">{value}</p>
          </div>
        ))}
        {user.image && (
          <div
            className="k-card k-in flex items-center gap-4 sm:col-span-3"
            style={{ "--i": 5 } as React.CSSProperties}
          >
            <Image
              src={user.image}
              alt={user.name ?? "Avatar"}
              width={56}
              height={56}
              className="size-14 rounded-full ring-2 ring-accent"
            />
            <p className="text-sm text-muted">
              Imagen de perfil entregada por {provider}.
            </p>
          </div>
        )}
      </div>

      <Marquee
        items={["Sesión protegida", "JWT firmado", "Ruta privada"]}
        variant="line"
        speed={40}
        className="-mx-6 sm:-mx-10"
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
