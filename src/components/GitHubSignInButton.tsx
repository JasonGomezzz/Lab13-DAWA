"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function GitHubSignInButton({
  callbackUrl = "/dashboard",
}: {
  callbackUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn("github", { callbackUrl })}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-zinc-900 px-5 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      <FaGithub className="size-5" />
      Continuar con GitHub
    </button>
  );
}
