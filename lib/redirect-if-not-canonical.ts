import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCanonicalAuthUrl } from "./canonical-origin";

export async function redirectIfNotCanonical(path: string): Promise<void> {
  const canonical = getCanonicalAuthUrl();
  if (!canonical) {
    return;
  }

  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";

  if (!host) {
    return;
  }

  const canonicalHost = new URL(canonical).host;
  const requestHost = host.split(":")[0];

  if (requestHost !== canonicalHost) {
    const destination = new URL(path, canonical);
    redirect(destination.toString());
  }
}
