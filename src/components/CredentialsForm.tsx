"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Correo o contraseña incorrectos.",
  ACCOUNT_LOCKED:
    "Demasiados intentos fallidos. La cuenta quedó bloqueada 15 minutos.",
};

export default function CredentialsForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.ok && !result.error) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setError(
      MESSAGES[result?.error ?? ""] ?? "No se pudo iniciar sesión. Intenta de nuevo.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Correo electrónico"
        className="h-12 rounded-lg border border-zinc-300 bg-transparent px-4 dark:border-zinc-700"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Contraseña"
        className="h-12 rounded-lg border border-zinc-300 bg-transparent px-4 dark:border-zinc-700"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-full bg-foreground font-medium text-background transition-colors hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
