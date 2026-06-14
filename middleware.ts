import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function redirectToCanonical(request: NextRequest): NextResponse | null {
  const raw = process.env.NEXTAUTH_URL?.trim();
  if (!raw) {
    return null;
  }

  const canonicalUrl = raw.replace(/\/$/, "");
  const canonicalHost = new URL(canonicalUrl).host;
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const requestHost = host.split(":")[0];

  if (!requestHost || requestHost === canonicalHost) {
    return null;
  }

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.host = canonicalHost;

  return NextResponse.redirect(destination);
}

export async function middleware(request: NextRequest) {
  const canonicalRedirect = redirectToCanonical(request);
  if (canonicalRedirect) {
    return canonicalRedirect;
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/signIn", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
