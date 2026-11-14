"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import RollText from "./kinetic/RollText";

export default function GitHubSignInButton({
  callbackUrl = "/dashboard",
  disabled = false,
}: {
  callbackUrl?: string;
  /** true cuando faltan GITHUB_ID / GITHUB_SECRET en el entorno */
  disabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => signIn("github", { callbackUrl })}
        className="k-btn k-btn-ghost disabled:cursor-not-allowed"
      >
        <FaGithub className="size-5" />
        <RollText>Continuar con GitHub</RollText>
      </button>
      {disabled && (
        <p className="-mt-1 text-xs text-muted">
          Falta configurar <code className="font-mono">GITHUB_ID</code> y{" "}
          <code className="font-mono">GITHUB_SECRET</code> en{" "}
          <code className="font-mono">.env.local</code>.
        </p>
      )}
    </>
  );
}
