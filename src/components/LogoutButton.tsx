"use client";

import { signOut } from "next-auth/react";
import RollText from "./kinetic/RollText";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/signIn" })}
      className="k-btn k-btn-ghost k-btn-sm"
    >
      <RollText>Cerrar sesión</RollText>
    </button>
  );
}
