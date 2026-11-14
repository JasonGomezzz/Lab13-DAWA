import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

async function DashboardContent() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const { user } = session;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
      {user.image && (
        <Image
          src={user.image}
          alt={user.name ?? "Avatar"}
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hola, {user.name}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
