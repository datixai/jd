import fs from "node:fs";
import path from "node:path";

// Reads public/media at build time, so dropping new photos or videos in and rebuilding updates the site.
const publicDir = path.join(process.cwd(), "public");

export function exists(publicPath?: string): boolean {
  if (!publicPath) return false;
  return fs.existsSync(path.join(publicDir, publicPath));
}
