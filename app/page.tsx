import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthCard, AuthShell } from "@/components/AuthLayout";
import { authOptions } from "@/lib/auth";

const linkPrimary =
  "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700";
const linkSecondary =
  "rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell>
      <AuthCard
        title="Next Auth App"
        subtitle="Sistema de autenticación con Google, GitHub y credenciales seguras."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/signIn" className={linkPrimary}>
            Iniciar sesión
          </Link>
          <Link href="/register" className={linkSecondary}>
            Registrarse
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
