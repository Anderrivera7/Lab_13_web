import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-white to-blue-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_55%)]"
        aria-hidden
      />
      {children}
    </main>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-blue-600 hover:text-blue-700"
        >
          Next Auth App
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-6 border-t border-zinc-100 pt-6 text-center text-sm text-zinc-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export const authInputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export const authLabelClass = "block text-sm font-medium text-zinc-700";

export const authPrimaryButtonClass =
  "w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60";

export const authSocialButtonClass =
  "flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]";

export function AuthDivider({ label = "o continúa con" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-zinc-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
          {label}
        </span>
      </div>
    </div>
  );
}
