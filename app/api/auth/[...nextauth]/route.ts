import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { withCanonicalOrigin } from "@/lib/canonical-origin";

const handler = NextAuth(authOptions);

export async function GET(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handler(await withCanonicalOrigin(request), context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handler(await withCanonicalOrigin(request), context);
}
