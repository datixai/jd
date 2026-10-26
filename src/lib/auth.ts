import "server-only";
import { SESSION_COOKIE, SESSION_HOURS, createToken, verifyToken } from "./session";

export { SESSION_COOKIE, checkCredentials } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function startSession(email: string) {
  (await cookies()).set(SESSION_COOKIE, createToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdmin() {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

// Every admin page and server action calls this. The proxy check alone is not enough.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// Simple in-memory limiter. Replace with the database or Redis when it is configured.
const hits = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  h.count += 1;
  return h.count <= max;
}

export function clearRateLimit(key: string) {
  hits.delete(key);
}
