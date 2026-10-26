import fs from "node:fs";
import path from "node:path";

// Reads public/media at build time, so dropping new photos or videos in and rebuilding updates the site.
const publicDir = path.join(process.cwd(), "public");

export function exists(publicPath?: string): boolean {
  if (!publicPath) return false;
  return fs.existsSync(path.join(publicDir, publicPath));
}

export type MediaItem = { src: string; type: "image" | "video" };

export function listGallery(): MediaItem[] {
  const dir = path.join(publicDir, "media", "gallery");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif|mp4|webm|mov)$/i.test(f))
    .sort()
    .map((f) => ({
      src: `/media/gallery/${f}`,
      type: /\.(mp4|webm|mov)$/i.test(f) ? "video" : "image",
    }));
}
