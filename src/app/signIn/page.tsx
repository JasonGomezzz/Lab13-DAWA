import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";

async function LoginContent() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Accede con tu cuenta de Google para continuar.
        </p>
      </div>
      <GoogleSignInButton />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
