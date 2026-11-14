import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function ProfileContent() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const { user } = session;

  return (
    <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-zinc-950">
      <h1 className="mb-4 text-3xl font-bold">Profile</h1>
      <div className="mb-6">
        <p className="mb-2 text-gray-700 dark:text-zinc-300">
          Nombre: <span className="font-semibold">{user.name}</span>
        </p>
        <p className="mb-2 text-gray-700 dark:text-zinc-300">
          Correo: <span className="font-semibold">{user.email}</span>
        </p>
        {user.image && (
          <>
            <p className="mb-2 text-gray-700 dark:text-zinc-300">
              Imagen de perfil:
            </p>
            <Image
              src={user.image}
              alt="Perfil"
              width={100}
              height={100}
              className="mt-4 size-16 rounded-full"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="flex flex-1 justify-center bg-gray-100 p-8 dark:bg-black">
      <Suspense fallback={null}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}
