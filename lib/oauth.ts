function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function getGoogleCredentials() {
  const clientId = readEnv("GOOGLE_CLIENT_ID");
  const clientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  return { clientId, clientSecret };
}

export function getGitHubCredentials() {
  const clientId = readEnv(
    "GITHUB_ID",
    "GITHUB_CLIENT_ID",
    "AUTH_GITHUB_ID"
  );
  const clientSecret = readEnv(
    "GITHUB_SECRET",
    "GITHUB_CLIENT_SECRET",
    "AUTH_GITHUB_SECRET"
  );
  return { clientId, clientSecret };
}

export function isGoogleConfigured() {
  const { clientId, clientSecret } = getGoogleCredentials();
  return Boolean(clientId && clientSecret);
}

export function isGitHubConfigured() {
  const { clientId, clientSecret } = getGitHubCredentials();
  return Boolean(clientId && clientSecret);
}
