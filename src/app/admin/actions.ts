"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkCredentials, clearRateLimit, endSession, rateLimit, requireAdmin, startSession } from "@/lib/auth";
import { deleteEnquiry, saveContent } from "@/lib/store";
import type { SiteContent, Scene } from "@/content/site";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

export async function loginAction(_prev: { error?: string } | undefined, form: FormData) {
  const ip = await clientIp();
  const key = `login:${ip}`;
  if (!rateLimit(key, 5, 15 * 60_000)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const email = String(form.get("email") ?? "").slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!checkCredentials(email, password)) {
    return { error: "Wrong email or password." };
  }
  clearRateLimit(key);
  await startSession(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

const scenes: Scene[] = ["valley", "lake", "peaks", "forest", "meadow", "river"];
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const url = (v: unknown) => {
  const s = str(v, 300);
  return /^https:\/\/[^\s<>"']+$/i.test(s) ? s : "";
};
const mediaPath = (v: unknown) => {
  const s = str(v, 200);
  return /^\/media\/[\w\-/]+\.(jpe?g|png|webp|avif)$/i.test(s) && !s.includes("..") ? s : undefined;
};

// Never trust what the browser sends: rebuild the content object field by field.
function sanitize(raw: unknown): SiteContent {
  type Obj = Record<string, unknown>;
  const c = (raw ?? {}) as { hero?: Obj; contact?: Obj; trips?: unknown; faqs?: unknown };
  const h = c.hero ?? {};
  const k = c.contact ?? {};
  const list = (v: unknown) => (Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as Obj[]) : []);
  return {
    hero: { eyebrow: str(h.eyebrow, 120), title: str(h.title, 120), tagline: str(h.tagline, 80), text: str(h.text, 500) },
    contact: {
      name: str(k.name, 80),
      phoneDisplay: str(k.phoneDisplay, 30),
      phoneTel: str(k.phoneDisplay, 30).replace(/[^\d+]/g, ""),
      whatsapp: str(k.whatsapp, 20).replace(/\D/g, ""),
      instagram: url(k.instagram),
      instagramHandle: str(k.instagramHandle, 60),
      facebook: url(k.facebook),
    },
    trips: list(c.trips).slice(0, 30).map((t) => ({
      title: str(t.title, 100),
      days: str(t.days, 30),
      region: str(t.region, 60),
      highlights: (Array.isArray(t.highlights) ? t.highlights : []).slice(0, 6).map((x: unknown) => str(x, 60)).filter(Boolean),
      scene: scenes.includes(t.scene as Scene) ? (t.scene as Scene) : "valley",
      image: mediaPath(t.image),
    })),
    faqs: list(c.faqs).slice(0, 30).map((f) => ({ q: str(f.q, 200), a: str(f.a, 1000) })),
  };
}

export async function saveContentAction(raw: unknown) {
  await requireAdmin();
  await saveContent(sanitize(raw));
  revalidatePath("/");
  return { ok: true };
}

export async function deleteEnquiryAction(id: string) {
  await requireAdmin();
  await deleteEnquiry(str(id, 60));
  revalidatePath("/admin");
}
