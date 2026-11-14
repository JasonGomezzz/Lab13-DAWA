import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, githubEnabled } from "@/lib/auth";
import CredentialsForm from "@/components/CredentialsForm";
import GitHubSignInButton from "@/components/GitHubSignInButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";

async function LoginContent() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Usa tu correo o continúa con un proveedor.
        </p>
      </div>
      <CredentialsForm />
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        o
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-3">
        <GoogleSignInButton />
        {githubEnabled && <GitHubSignInButton />}
      </div>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
