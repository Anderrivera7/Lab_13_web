import type { LoginAttempt } from "./types";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const attempts = new Map<string, LoginAttempt>();

function getKey(email: string): string {
  return email.toLowerCase().trim();
}

export function isAccountLocked(email: string): boolean {
  const key = getKey(email);
  const record = attempts.get(key);

  if (!record?.lockedUntil) {
    return false;
  }

  if (Date.now() >= record.lockedUntil) {
    attempts.delete(key);
    return false;
  }

  return true;
}

export function getLockRemainingMinutes(email: string): number {
  const key = getKey(email);
  const record = attempts.get(key);

  if (!record?.lockedUntil) {
    return 0;
  }

  const remainingMs = record.lockedUntil - Date.now();
  return Math.max(1, Math.ceil(remainingMs / 60000));
}

export function recordFailedAttempt(email: string): void {
  const key = getKey(email);
  const record = attempts.get(key) ?? { count: 0, lockedUntil: null };

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS;
    record.count = 0;
  }

  attempts.set(key, record);
}

export function resetLoginAttempts(email: string): void {
  attempts.delete(getKey(email));
}
