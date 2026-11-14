import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";
import AuthShell from "@/components/kinetic/AuthShell";

async function RegisterContent() {
  // Sesión leída por petición: evita el prerender de valores aleatorios (csrf).
  await connection();
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <AuthShell
      tag="Lab 13 / Registro"
      lines={[
        { text: "Crea" },
        { text: "tu", variant: "outline" },
        { text: "acceso.", variant: "accent" },
      ]}
    >
      <div className="flex flex-col gap-8">
        <div className="k-in" style={{ "--i": 0 } as React.CSSProperties}>
          <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
            Nueva cuenta
          </p>
        </div>
        <div className="k-in" style={{ "--i": 1 } as React.CSSProperties}>
          <RegisterForm />
        </div>
        <p
          className="k-in text-sm text-muted"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          ¿Ya tienes cuenta?{" "}
          <Link href="/signIn" className="font-semibold text-accent underline underline-offset-4">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <RegisterContent />
    </Suspense>
  );
}
