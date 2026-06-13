import Image from "next/image";
import type { Session } from "next-auth";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import LogoutButton from "@/components/LogoutButton";

export default function AppShell({
  session,
  title,
  description,
  children,
}: {
  session: Session;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const initial = (session.user?.name?.[0] ?? session.user?.email?.[0] ?? "U")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-zinc-100 px-6">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-blue-600"
          >
            Next Auth App
          </Link>
        </div>

        <div className="flex flex-1 flex-col px-4 py-6">
          <AppNav />
        </div>

        <div className="border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-white"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {initial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {session.user?.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {session.user?.email}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <LogoutButton fullWidth />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-600 lg:hidden">
                Next Auth App
              </p>
              <h1 className="truncate text-xl font-bold text-zinc-900 sm:text-2xl">
                {title}
              </h1>
              {description && (
                <p className="hidden text-sm text-zinc-500 sm:block">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-zinc-100 lg:hidden"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 lg:hidden">
                  {initial}
                </div>
              )}
              <LogoutButton className="lg:hidden" />
            </div>
          </div>

          <div className="overflow-x-auto border-t border-zinc-100 px-4 py-2 lg:hidden">
            <AppNav orientation="horizontal" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
