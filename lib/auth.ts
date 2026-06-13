import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {
  getLockRemainingMinutes,
  isAccountLocked,
  recordFailedAttempt,
  resetLoginAttempts,
} from "./loginAttempts";
import {
  getGoogleCredentials,
  getGitHubCredentials,
  isGoogleConfigured,
  isGitHubConfigured,
} from "./oauth";
import { findUserByEmail } from "./users";

function buildProviders(): NextAuthOptions["providers"] {
  const providers: NextAuthOptions["providers"] = [];

  if (isGoogleConfigured()) {
    const { clientId, clientSecret } = getGoogleCredentials();
    providers.push(
      GoogleProvider({
        clientId: clientId!,
        clientSecret: clientSecret!,
      })
    );
  }

  if (isGitHubConfigured()) {
    const { clientId, clientSecret } = getGitHubCredentials();
    providers.push(
      GitHubProvider({
        clientId: clientId!,
        clientSecret: clientSecret!,
      })
    );
  }

  providers.push(
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Correo y contraseña son obligatorios");
        }

        const email = credentials.email.trim();

        if (isAccountLocked(email)) {
          const minutes = getLockRemainingMinutes(email);
          throw new Error(
            `Cuenta bloqueada por varios intentos fallidos. Intenta en ${minutes} minuto(s).`
          );
        }

        const user = await findUserByEmail(email);

        if (!user) {
          recordFailedAttempt(email);
          throw new Error("Credenciales incorrectas");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          recordFailedAttempt(email);
          throw new Error("Credenciales incorrectas");
        }

        resetLoginAttempts(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    })
  );

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      } else if (account?.providerAccountId && !token.id) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
