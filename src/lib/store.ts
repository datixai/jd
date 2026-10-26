import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { contact, faqs, hero, trips, type Faq, type SiteContent } from "@/content/site";

// File based store for now. When the database is configured, only this file needs to change.
const dataDir = path.join(process.cwd(), "data");
const contentFile = path.join(dataDir, "content.json");
const enquiriesFile = path.join(dataDir, "enquiries.json");

export const defaultContent: SiteContent = { hero, contact, trips, faqs };

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export async function getContent(): Promise<SiteContent> {
  const saved = await readJson<Partial<SiteContent>>(contentFile, {});
  return { ...defaultContent, ...saved, contact: { ...defaultContent.contact, ...saved.contact } };
}

export async function saveContent(content: SiteContent) {
  await writeJson(contentFile, content);
}

export type Enquiry = {
  id: string;
  createdAt: string;
  name: string;
  from: string;
  people: string;
  dates: string;
  where: string;
};

export async function listEnquiries(): Promise<Enquiry[]> {
  return readJson<Enquiry[]>(enquiriesFile, []);
}

export async function addEnquiry(e: Omit<Enquiry, "id" | "createdAt">) {
  const all = await listEnquiries();
  all.unshift({ ...e, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  await writeJson(enquiriesFile, all.slice(0, 2000));
}

export async function deleteEnquiry(id: string) {
  const all = await listEnquiries();
  await writeJson(enquiriesFile, all.filter((e) => e.id !== id));
}

export type { Faq };
