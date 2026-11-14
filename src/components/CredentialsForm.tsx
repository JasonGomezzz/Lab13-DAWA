"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import RollText from "./kinetic/RollText";

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
      MESSAGES[result?.error ?? ""] ??
        "No se pudo iniciar sesión. Intenta de nuevo.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7">
      <label className="k-field">
        <span className="k-label">Correo</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="k-input"
        />
      </label>
      <label className="k-field">
        <span className="k-label">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="k-input"
        />
      </label>
      {error && (
        <p role="alert" className="k-error text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="k-btn k-btn-primary">
        <RollText>{loading ? "Ingresando..." : "Iniciar sesión"}</RollText>
      </button>
    </form>
  );
}
