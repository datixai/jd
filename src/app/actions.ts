"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/auth";
import { addEnquiry } from "@/lib/store";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function submitEnquiry(data: Record<string, unknown>) {
  // Honeypot field: real visitors never fill it.
  if (clean(data.website, 100)) return { ok: true };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`enquiry:${ip}`, 5, 60 * 60_000)) return { ok: false };
  const name = clean(data.name, 80);
  if (!name) return { ok: false };
  await addEnquiry({
    name,
    from: clean(data.from, 40),
    people: clean(data.people, 80),
    dates: clean(data.dates, 80),
    where: clean(data.where, 80),
  });
  return { ok: true };
}
