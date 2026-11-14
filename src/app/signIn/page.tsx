import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, githubEnabled } from "@/lib/auth";
import CredentialsForm from "@/components/CredentialsForm";
import GitHubSignInButton from "@/components/GitHubSignInButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import AuthShell from "@/components/kinetic/AuthShell";

async function LoginContent() {
  // Sesión leída por petición: evita el prerender de valores aleatorios (csrf).
  await connection();
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <AuthShell
      tag="Lab 13 / Acceso"
      lines={[
        { text: "Entra" },
        { text: "a tu", variant: "outline" },
        { text: "cuenta.", variant: "accent" },
      ]}
    >
      <div className="flex flex-col gap-8">
        <div className="k-in" style={{ "--i": 0 } as React.CSSProperties}>
          <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
            Iniciar sesión
          </p>
        </div>
        <div className="k-in" style={{ "--i": 1 } as React.CSSProperties}>
          <CredentialsForm />
        </div>
        <div
          className="k-in flex items-center gap-4 font-mono text-xs text-muted uppercase"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          <span className="h-px flex-1 bg-line" />o
          <span className="h-px flex-1 bg-line" />
        </div>
        <div
          className="k-in flex flex-col gap-3"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          <GoogleSignInButton />
          {githubEnabled && <GitHubSignInButton />}
        </div>
        <p
          className="k-in text-sm text-muted"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-accent underline underline-offset-4">
            Regístrate
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <LoginContent />
    </Suspense>
  );
}
