"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton({
  callbackUrl = "/dashboard",
}: {
  callbackUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-black/[.08] bg-white px-5 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
    >
      <FcGoogle className="size-5" />
      Continuar con Google
    </button>
  );
}
