import { NextResponse } from "next/server";
import { registerUser, validateRegistration } from "@/lib/credentials";
import { DuplicateEmailError } from "@/lib/users";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const { name, email, password, errors } = validateRegistration(
    (body ?? {}) as Record<string, unknown>,
  );
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    await registerUser({ name, email, password });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo." },
        { status: 409 },
      );
    }
    console.error("Error al registrar usuario", error);
    return NextResponse.json(
      { error: "No se pudo crear la cuenta." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
