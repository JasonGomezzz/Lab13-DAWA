import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <nav className="w-full bg-black text-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold">
          MyAuthApp
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link href="/dashboard" className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/profile" className="hover:text-gray-400">
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
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                  />
                </li>
              )}
            </>
          ) : (
            <li>
              <Link href="/signIn" className="hover:text-gray-400">
                Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
