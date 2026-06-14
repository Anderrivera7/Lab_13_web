"use client";

import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import {
  AuthCard,
  AuthDivider,
  AuthShell,
  authInputClass,
  authLabelClass,
  authPrimaryButtonClass,
  authSocialButtonClass,
} from "@/components/AuthLayout";

const oauthErrorMessages: Record<string, string> = {
  github:
    "No se pudo iniciar sesión con GitHub. Verifica la callback URL en GitHub.",
  google:
    "No se pudo iniciar sesión con Google. Verifica las credenciales en Vercel.",
  OAuthSignin:
    "Error al conectar con el proveedor OAuth. Revisa las credenciales.",
  OAuthCallback:
    "Falló el retorno desde GitHub. Usa siempre la URL principal de Vercel (NEXTAUTH_URL).",
  AccessDenied: "Acceso denegado. No se autorizó el inicio de sesión.",
  Configuration:
    "Error de configuración. Revisa NEXTAUTH_SECRET y NEXTAUTH_URL en Vercel.",
  Callback:
    "Error en el callback OAuth. La URL debe ser: tu-dominio.vercel.app/api/auth/callback/github",
  csrf:
    "Error de seguridad (CSRF). Abre la app con la URL de NEXTAUTH_URL y vuelve a intentar.",
};

function getOAuthErrorMessage(error: string): string {
  return oauthErrorMessages[error] ?? "Error al iniciar sesión. Intenta nuevamente.";
}

function getCallbackUrl(
  callbackUrl: string,
  appUrl: string | undefined
): string {
  const base = appUrl?.replace(/\/$/, "") ?? window.location.origin;
  return callbackUrl.startsWith("http")
    ? callbackUrl
    : `${base}${callbackUrl.startsWith("/") ? callbackUrl : `/${callbackUrl}`}`;
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    urlError ? getOAuthErrorMessage(urlError) : ""
  );
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<{
    google?: boolean;
    github?: boolean;
  }>({});

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  useEffect(() => {
    getProviders().then((providers) => {
      setAvailableProviders({
        google: Boolean(providers?.google),
        github: Boolean(providers?.github),
      });
      setReady(true);
    });
  }, []);

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const lockCheck = await fetch("/api/check-lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const lockData = await lockCheck.json();

    if (lockData.locked) {
      setLoading(false);
      setError(
        `Cuenta bloqueada por varios intentos fallidos. Intenta en ${lockData.minutes} minuto(s).`
      );
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: getCallbackUrl(callbackUrl, appUrl),
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setError("");
    signIn(provider, {
      callbackUrl: getCallbackUrl(callbackUrl, appUrl),
    });
  }

  const hasSocialLogin =
    availableProviders.google || availableProviders.github;

  if (!ready) {
    return (
      <AuthShell>
        <div className="text-sm text-zinc-500">Cargando...</div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard
        title="Iniciar sesión"
        subtitle="Usa tu correo y contraseña, o accede con una cuenta social."
        footer={
          <>
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Regístrate
            </Link>
          </>
        }
      >
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={authLabelClass}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={authLabelClass}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || oauthLoading !== null}
            className={authPrimaryButtonClass}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {hasSocialLogin && (
          <>
            <AuthDivider />

            <div className="flex flex-col gap-3">
              {availableProviders.google && (
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  disabled={loading || oauthLoading !== null}
                  className={authSocialButtonClass}
                >
                  <FaGoogle className="text-lg text-[#EA4335]" />
                  {oauthLoading === "google"
                    ? "Conectando con Google..."
                    : "Continuar con Google"}
                </button>
              )}

              {availableProviders.github && (
                <button
                  type="button"
                  onClick={() => handleOAuth("github")}
                  disabled={loading || oauthLoading !== null}
                  className={authSocialButtonClass}
                >
                  <FaGithub className="text-lg text-zinc-900" />
                  {oauthLoading === "github"
                    ? "Conectando con GitHub..."
                    : "Continuar con GitHub"}
                </button>
              )}
            </div>
          </>
        )}

        {!availableProviders.github && availableProviders.google && (
          <p className="mt-4 text-xs text-zinc-500">
            GitHub no está disponible. Agrega GITHUB_ID y GITHUB_SECRET en
            Vercel.
          </p>
        )}
      </AuthCard>
    </AuthShell>
  );
}

export function SignInFormSuspense() {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div className="text-sm text-zinc-500">Cargando...</div>
        </AuthShell>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
