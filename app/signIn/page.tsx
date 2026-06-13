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
    "No se pudo iniciar sesión con GitHub. Usa http://localhost:3000 (no 127.0.0.1 ni otra IP) y reinicia el servidor tras cambiar .env.",
  google:
    "No se pudo iniciar sesión con Google. Usa http://localhost:3000 y verifica las credenciales en .env.",
  OAuthSignin:
    "Error al conectar con el proveedor OAuth. Revisa las credenciales y la URL de callback.",
  OAuthCallback:
    "Error en la respuesta del proveedor OAuth. Verifica la configuración de tu aplicación.",
  AccessDenied: "Acceso denegado. No se autorizó el inicio de sesión.",
  Configuration:
    "Error de configuración de autenticación. Revisa las variables de entorno.",
  Callback:
    "Error en el callback OAuth. Verifica que la URL de callback en GitHub sea http://localhost:3000/api/auth/callback/github",
  csrf:
    "Error de seguridad (CSRF). Recarga la página e intenta de nuevo usando http://localhost:3000",
};

function getOAuthErrorMessage(error: string): string {
  return oauthErrorMessages[error] ?? "Error al iniciar sesión. Intenta nuevamente.";
}

function SignInForm() {
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
  const [availableProviders, setAvailableProviders] = useState<{
    google?: boolean;
    github?: boolean;
  }>({});

  useEffect(() => {
    getProviders().then((providers) => {
      setAvailableProviders({
        google: Boolean(providers?.google),
        github: Boolean(providers?.github),
      });
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
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setError("");

    const result = await signIn(provider, { callbackUrl, redirect: false });

    if (result?.error) {
      setOauthLoading(null);
      setError(getOAuthErrorMessage(result.error));
      return;
    }

    if (result?.url) {
      const target = new URL(result.url, window.location.origin);
      if (target.searchParams.get("error")) {
        setOauthLoading(null);
        setError(
          getOAuthErrorMessage(target.searchParams.get("error") ?? "OAuthSignin")
        );
        return;
      }
      window.location.href = result.url;
    }
  }

  const hasSocialLogin =
    availableProviders.google || availableProviders.github;

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
            GitHub no está disponible. Agrega GITHUB_ID y GITHUB_SECRET en tu
            archivo .env.
          </p>
        )}
      </AuthCard>
    </AuthShell>
  );
}

export default function SignInPage() {
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
