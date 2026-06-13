import { promises as fs } from "fs";
import path from "path";
import type { StoredUser } from "./types";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<StoredUser[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
): Promise<StoredUser> {
  const users = await readUsers();

  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("El correo ya está registrado");
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}
