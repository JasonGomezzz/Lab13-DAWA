import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterForm from "@/components/RegisterForm";

async function RegisterContent() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Regístrate con tu correo y una contraseña segura.
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/signIn" className="font-medium underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
      <Suspense fallback={null}>
        <RegisterContent />
      </Suspense>
    </main>
  );
}
