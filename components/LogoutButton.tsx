"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({
  fullWidth = false,
  className = "",
}: {
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      Cerrar sesión
    </button>
  );
}
