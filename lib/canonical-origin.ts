export function getCanonicalAuthUrl(): string | null {
  const raw = process.env.NEXTAUTH_URL?.trim();
  if (!raw) {
    return null;
  }

  return raw.replace(/\/$/, "");
}

export async function withCanonicalOrigin(request: Request): Promise<Request> {
  const canonicalUrl = getCanonicalAuthUrl();
  if (!canonicalUrl) {
    return request;
  }

  const canonicalHost = new URL(canonicalUrl).host;
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", canonicalHost);
  headers.set("x-forwarded-proto", "https");

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.clone().text()
      : undefined;

  return new Request(request.url, {
    method: request.method,
    headers,
    body,
  });
}
