import Image from "next/image";
import { getServerSession } from "next-auth";
import AppShell from "@/components/AppShell";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const initial = (session.user?.name?.[0] ?? "U").toUpperCase();

  return (
    <AppShell
      session={session}
      title="Perfil"
      description="Detalles de tu sesión y cuenta"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar del usuario"
                width={120}
                height={120}
                className="rounded-full ring-4 ring-blue-50"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
                {initial}
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-zinc-900">
                {session.user?.name ?? "Usuario"}
              </h2>
              <p className="mt-1 text-zinc-500">{session.user?.email}</p>
              <p className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Sesión verificada
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              Información personal
            </h3>
            <dl className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-sm text-zinc-500">Nombre completo</dt>
                <dd className="text-sm font-medium text-zinc-900">
                  {session.user?.name ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-sm text-zinc-500">Correo electrónico</dt>
                <dd className="text-sm font-medium text-zinc-900">
                  {session.user?.email ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sm text-zinc-500">Avatar</dt>
                <dd className="text-sm font-medium text-zinc-900">
                  {session.user?.image ? "Disponible" : "No configurado"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              Datos de sesión
            </h3>
            <dl className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-sm text-zinc-500">ID de usuario</dt>
                <dd className="truncate font-mono text-sm font-medium text-zinc-900">
                  {session.user?.id}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-sm text-zinc-500">Tipo de autenticación</dt>
                <dd className="text-sm font-medium text-zinc-900">NextAuth.js</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sm text-zinc-500">Rutas protegidas</dt>
                <dd className="text-sm font-medium text-zinc-900">
                  Inicio, Perfil
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">
            Seguridad de la cuenta
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Esta aplicación utiliza NextAuth.js con protección de rutas mediante
            middleware, cifrado bcrypt para credenciales y bloqueo tras intentos
            fallidos de inicio de sesión.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                OAuth
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                Google y GitHub
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Contraseñas
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                Cifrado con bcrypt
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Intentos fallidos
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                Bloqueo temporal
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
