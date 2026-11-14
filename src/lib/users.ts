import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import postgres from "postgres";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  failedAttempts: number;
  lockedUntil: number | null;
  createdAt: string;
};

type UserStore = {
  findByEmail(email: string): Promise<UserRecord | null>;
  create(user: UserRecord): Promise<void>;
  updateLockState(
    id: string,
    failedAttempts: number,
    lockedUntil: number | null,
  ): Promise<void>;
};

export class DuplicateEmailError extends Error {
  constructor() {
    super("EMAIL_EXISTS");
  }
}

/* ---------- Almacén en archivo JSON (desarrollo local) ---------- */

function fileStore(): UserStore {
  // En Vercel el disco es de solo lectura salvo /tmp (efímero): usar DATABASE_URL.
  const file = process.env.VERCEL
    ? "/tmp/users.json"
    : path.join(process.cwd(), "data", "users.json");

  async function read(): Promise<UserRecord[]> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as UserRecord[];
    } catch {
      return [];
    }
  }

  async function write(users: UserRecord[]) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(users, null, 2), "utf8");
  }

  return {
    async findByEmail(email) {
      return (await read()).find((u) => u.email === email) ?? null;
    },
    async create(user) {
      const users = await read();
      if (users.some((u) => u.email === user.email)) {
        throw new DuplicateEmailError();
      }
      await write([...users, user]);
    },
    async updateLockState(id, failedAttempts, lockedUntil) {
      const users = await read();
      const user = users.find((u) => u.id === id);
      if (!user) return;
      user.failedAttempts = failedAttempts;
      user.lockedUntil = lockedUntil;
      await write(users);
    },
  };
}

/* ---------- Almacén en PostgreSQL (Vercel / producción) ---------- */

type Row = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  failed_attempts: number;
  locked_until: string | null;
  created_at: Date;
};

function postgresStore(rawUrl: string): UserStore {
  // Neon agrega channel_binding/sslmode a la URL; se quitan para no enviarlos como
  // parámetros del servidor y el SSL se exige por opción. prepare:false por el pooler.
  const url = new URL(rawUrl);
  url.searchParams.delete("channel_binding");
  url.searchParams.delete("sslmode");
  const sql = postgres(url.toString(), { ssl: "require", max: 1, prepare: false });
  let ready: Promise<unknown> | null = null;

  function init() {
    ready ??= sql`
      CREATE TABLE IF NOT EXISTS app_users (
        id text PRIMARY KEY,
        name text NOT NULL,
        email text UNIQUE NOT NULL,
        password_hash text NOT NULL,
        failed_attempts integer NOT NULL DEFAULT 0,
        locked_until bigint,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    return ready;
  }

  const toUser = (r: Row): UserRecord => ({
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    failedAttempts: r.failed_attempts,
    lockedUntil: r.locked_until === null ? null : Number(r.locked_until),
    createdAt: r.created_at.toISOString(),
  });

  return {
    async findByEmail(email) {
      await init();
      const rows = await sql<Row[]>`SELECT * FROM app_users WHERE email = ${email}`;
      return rows[0] ? toUser(rows[0]) : null;
    },
    async create(user) {
      await init();
      try {
        await sql`
          INSERT INTO app_users (id, name, email, password_hash)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${user.passwordHash})`;
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          throw new DuplicateEmailError();
        }
        throw error;
      }
    },
    async updateLockState(id, failedAttempts, lockedUntil) {
      await init();
      await sql`
        UPDATE app_users
        SET failed_attempts = ${failedAttempts}, locked_until = ${lockedUntil}
        WHERE id = ${id}`;
    },
  };
}

const globalForStore = globalThis as unknown as { userStore?: UserStore };

export function getUserStore(): UserStore {
  globalForStore.userStore ??= process.env.DATABASE_URL
    ? postgresStore(process.env.DATABASE_URL)
    : fileStore();
  return globalForStore.userStore;
}

export function newUser(
  data: Pick<UserRecord, "name" | "email" | "passwordHash">,
): UserRecord {
  return {
    id: randomUUID(),
    ...data,
    failedAttempts: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
  };
}
