import { connection } from "next/server";
import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import KineticLine from "@/components/kinetic/KineticLine";

async function ProfileContent() {
  // Sesión leída por petición: evita el prerender de valores aleatorios (csrf).
  await connection();
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const { user } = session;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
          Perfil / Datos de la cuenta
        </p>
        <h1 className="k-display-md">
          <KineticLine text="Tu" variant="outline" />
          <KineticLine text="perfil." variant="accent" delay={140} />
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        {user.image ? (
          <Image
            src={user.image}
            alt="Perfil"
            width={160}
            height={160}
            className="k-in size-40 rounded-3xl object-cover ring-2 ring-accent"
          />
        ) : (
          <div
            className="k-in flex size-40 items-center justify-center rounded-3xl border border-line text-6xl font-extrabold text-accent uppercase"
            aria-hidden
          >
            {(user.name ?? "?").charAt(0)}
          </div>
        )}
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Nombre", user.name ?? "—"],
            ["Correo", user.email ?? "—"],
            ["ID de usuario", user.id],
            ["Proveedor", session.provider ?? "—"],
          ].map(([label, value], i) => (
            <div
              key={label}
              className="k-card k-in"
              style={{ "--i": i + 1 } as React.CSSProperties}
            >
              <dt className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
                {label}
              </dt>
              <dd className="mt-2 text-lg font-semibold break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={null}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}
