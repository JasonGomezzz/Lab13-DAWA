import bcrypt from "bcryptjs";
import { getUserStore, newUser, type UserRecord } from "./users";

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;
const BCRYPT_ROUNDS = 12;

export type CredentialsError = "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateRegistration(input: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email =
    typeof input.email === "string" ? normalizeEmail(input.email) : "";
  const password = typeof input.password === "string" ? input.password : "";

  const errors: string[] = [];
  if (name.length < 2 || name.length > 60) {
    errors.push("El nombre debe tener entre 2 y 60 caracteres.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    errors.push("Ingresa un correo electrónico válido.");
  }
  if (
    password.length < 8 ||
    // bcrypt solo procesa los primeros 72 bytes
    Buffer.byteLength(password) > 72 ||
    !/[A-Za-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    errors.push(
      "La contraseña debe tener entre 8 y 72 caracteres, con letras y números.",
    );
  }

  return { name, email, password, errors };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = newUser({ name: data.name, email: data.email, passwordHash });
  await getUserStore().create(user);
  return user;
}

// Hash de relleno para que el tiempo de respuesta no revele si el correo existe.
let dummyHash: Promise<string> | null = null;

/**
 * Verifica credenciales y aplica el bloqueo: tras MAX_FAILED_ATTEMPTS fallos
 * seguidos la cuenta queda bloqueada LOCK_MINUTES minutos.
 * Lanza Error(CredentialsError) cuando no se puede autenticar.
 */
export async function authenticate(
  rawEmail: string,
  password: string,
): Promise<UserRecord> {
  const store = getUserStore();
  const user = await store.findByEmail(normalizeEmail(rawEmail));

  if (!user) {
    dummyHash ??= bcrypt.hash("sin-usuario", BCRYPT_ROUNDS);
    await bcrypt.compare(password, await dummyHash);
    throw new Error("INVALID_CREDENTIALS" satisfies CredentialsError);
  }

  const now = Date.now();
  if (user.lockedUntil && user.lockedUntil > now) {
    throw new Error("ACCOUNT_LOCKED" satisfies CredentialsError);
  }
  // El bloqueo ya venció: se reinicia el contador.
  const previousFailures = user.lockedUntil ? 0 : user.failedAttempts;

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    const failures = previousFailures + 1;
    if (failures >= MAX_FAILED_ATTEMPTS) {
      await store.updateLockState(user.id, 0, now + LOCK_MINUTES * 60_000);
      throw new Error("ACCOUNT_LOCKED" satisfies CredentialsError);
    }
    await store.updateLockState(user.id, failures, null);
    throw new Error("INVALID_CREDENTIALS" satisfies CredentialsError);
  }

  if (user.failedAttempts !== 0 || user.lockedUntil !== null) {
    await store.updateLockState(user.id, 0, null);
  }
  return user;
}
