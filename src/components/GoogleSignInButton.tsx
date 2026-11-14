"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import RollText from "./kinetic/RollText";

export default function GoogleSignInButton({
  callbackUrl = "/dashboard",
}: {
  callbackUrl?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className="k-btn k-btn-ghost"
    >
      <FcGoogle className="size-5" />
      <RollText>Continuar con Google</RollText>
    </button>
  );
}
