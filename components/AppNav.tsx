"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUser } from "react-icons/fa";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: FaHome },
  { href: "/profile", label: "Perfil", icon: FaUser },
];

export default function AppNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  return (
    <nav
      className={
        orientation === "horizontal"
          ? "flex gap-2"
          : "flex flex-col gap-1"
      }
    >
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition whitespace-nowrap ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Icon className="text-base" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
