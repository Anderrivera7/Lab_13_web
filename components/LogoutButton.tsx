"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({
  fullWidth = false,
  className = "",
}: {
  fullWidth?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const callbackUrl = appUrl ? `${appUrl}/signIn` : "/signIn";

    await signOut({ callbackUrl, redirect: false });
    router.push("/signIn");
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-70 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
