import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "jfcr_admin_session";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function isValidSession(sessionValue: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const expected = hashPassword(adminPassword);
  return sessionValue === expected;
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionCookie();
  if (!session) return false;
  return isValidSession(session);
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
