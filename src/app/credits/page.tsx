import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { contact } from "@/content/site";

export const metadata: Metadata = { title: "Photo credits" };

// Each line of public/media/stock/credits.txt: <file> <unsplash photo id> <photographer name>
function stockCredits() {
  const file = path.join(process.cwd(), "public", "media", "stock", "credits.txt");
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((l) => l.trim().split(" "))
    .filter((p) => p.length >= 3)
    .map(([name, id, ...by]) => ({ name, id, by: by.join(" ") }));
}

export default function CreditsPage() {
  const credits = stockCredits();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <a href="/" className="text-sm text-lake hover:underline">Back to JD Travels</a>
      <h1 className="mt-4 text-4xl font-semibold text-pine">Photo credits</h1>
      <p className="mt-4 text-muted">
        Trip videos and their cover images are by {contact.name} ({contact.instagramHandle}). Other photos are free to use under the{" "}
        <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-lake hover:underline">Unsplash License</a>. Thank you to these photographers:
      </p>
      <ul className="mt-6 divide-y divide-line rounded-[18px] border border-line bg-white">
        {credits.map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
            <span className="capitalize">{c.name.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
            <span className="text-muted">{c.by} on Unsplash</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
