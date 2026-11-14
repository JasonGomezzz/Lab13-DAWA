import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

const link =
  "font-mono text-xs tracking-[0.14em] uppercase text-muted transition-colors hover:text-accent";

export default async function Navbar() {
  // Sesión leída por petición: evita el prerender de valores aleatorios (csrf).
  await connection();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight uppercase"
        >
          <span className="size-2.5 rounded-full bg-accent" />
          MyAuthApp
        </Link>
        <ul className="flex items-center gap-6">
          <li>
            <Link href="/dashboard" className={link}>
              Dashboard
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/profile" className={link}>
                  Profile
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
              {user.image && (
                <li>
                  <Image
                    src={user.image}
                    alt={user.name ?? "Perfil"}
                    width={36}
                    height={36}
                    className="size-9 rounded-full ring-2 ring-accent"
                  />
                </li>
              )}
            </>
          ) : (
            <li>
              <Link href="/signIn" className={link}>
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
