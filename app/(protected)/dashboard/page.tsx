import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import AppShell from "@/components/AppShell";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const initial = (session.user?.name?.[0] ?? "U").toUpperCase();

  return (
    <AppShell
      session={session}
      title="Inicio"
      description="Panel principal de tu cuenta autenticada"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-200 sm:p-8">
          <p className="text-sm font-medium text-blue-100">Bienvenido de vuelta</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {session.user?.name ?? "Usuario"}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
            Has iniciado sesión correctamente. Esta es tu página de inicio
            protegida y solo es accesible con autenticación activa.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Estado de sesión</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">Activa</p>
            <p className="mt-1 text-sm text-zinc-500">Autenticación verificada</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Correo</p>
            <p className="mt-2 truncate text-lg font-semibold text-zinc-900">
              {session.user?.email}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Cuenta vinculada</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-zinc-500">ID de usuario</p>
            <p className="mt-2 truncate font-mono text-sm font-semibold text-zinc-900">
              {session.user?.id}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Identificador de sesión</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-zinc-900">
              Resumen de cuenta
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Información principal de tu perfil autenticado.
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={72}
                  height={72}
                  className="rounded-full ring-4 ring-white"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                  {initial}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-zinc-900">
                  {session.user?.name ?? "Usuario"}
                </p>
                <p className="text-sm text-zinc-500">{session.user?.email}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Nombre
                </dt>
                <dd className="mt-1 font-medium text-zinc-900">
                  {session.user?.name ?? "—"}
                </dd>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Proveedor
                </dt>
                <dd className="mt-1 font-medium text-zinc-900">
                  {session.user?.image ? "OAuth / Credenciales" : "Credenciales"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              Acciones rápidas
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Navega entre las secciones de la aplicación.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/profile"
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Ver perfil completo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
