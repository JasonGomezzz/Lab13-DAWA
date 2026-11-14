"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? "No se pudo crear la cuenta.");
      setLoading(false);
      return;
    }

    // Cuenta creada: se inicia sesión de inmediato.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok && !result.error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/signIn");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        type="text"
        required
        minLength={2}
        maxLength={60}
        autoComplete="name"
        placeholder="Nombre completo"
        className="h-12 rounded-lg border border-zinc-300 bg-transparent px-4 dark:border-zinc-700"
      />
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
        minLength={8}
        maxLength={72}
        autoComplete="new-password"
        placeholder="Contraseña (mín. 8, con letras y números)"
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
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
