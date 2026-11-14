"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import RollText from "./kinetic/RollText";

export default function GitHubSignInButton({
  callbackUrl = "/dashboard",
}: {
  callbackUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn("github", { callbackUrl })}
      className="k-btn k-btn-ghost"
    >
      <FaGithub className="size-5" />
      <RollText>Continuar con GitHub</RollText>
    </button>
  );
}
