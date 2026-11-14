"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import RollText from "./kinetic/RollText";

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
    <form onSubmit={onSubmit} className="flex flex-col gap-7">
      <label className="k-field">
        <span className="k-label">Nombre</span>
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          placeholder="Tu nombre completo"
          className="k-input"
        />
      </label>
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
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="Mín. 8, con letras y números"
          className="k-input"
        />
      </label>
      {error && (
        <p role="alert" className="k-error text-sm text-danger">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="k-btn k-btn-primary">
        <RollText>{loading ? "Creando cuenta..." : "Crear cuenta"}</RollText>
      </button>
    </form>
  );
}
