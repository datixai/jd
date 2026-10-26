import crypto from "node:crypto";

// Pure session helpers (no Next.js request APIs), shared by proxy.ts and lib/auth.ts.
export const SESSION_COOKIE = "jd_admin";
export const SESSION_HOURS = 8;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters) in .env.local");
  return s;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Hash both sides first so length differences do not leak timing.
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminEmail || !adminPassword) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase());
  const passOk = safeEqual(password, adminPassword);
  return emailOk && passOk;
}

export function createToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, exp: Date.now() + SESSION_HOURS * 3600_000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string): { e: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e: string; exp: number };
    return data.exp > Date.now() ? { e: data.e } : null;
  } catch {
    return null;
  }
}

