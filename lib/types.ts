export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginAttempt {
  count: number;
  lockedUntil: number | null;
}
