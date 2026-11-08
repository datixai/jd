// Captures the JD Travels website (local build on port 3123) as full-page phone screenshots.
// The reel animates scrolling over these images, which gives smoother motion than a live recording.
// Usage: node capture.mjs   (needs `npx next start -p 3123` running in the project root)
import { chromium } from "file:///D:/SecretEye/marketing/reel/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
import path from "node:path";

const SITE = "http://localhost:3123";
const OUT = path.resolve("work/shots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function full(url, name, sections = []) {
  await page.goto(SITE + url, { waitUntil: "networkidle" });
  for (let y = 0; y < 30000; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(50);
  }
  await page.addStyleTag({ content: "header, .wa-ring, a[aria-label*='WhatsApp'].fixed, div.fixed { display: none !important; }" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  const meta = await page.evaluate((ids) => {
    const out = { height: document.documentElement.scrollHeight };
    for (const id of ids) {
      const el = document.querySelector(id);
      if (el) out[id] = el.getBoundingClientRect().top + window.scrollY;
    }
    return out;
  }, sections);
  // one screen at a time, stitched later in Python
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const tiles = [];
  for (let y = 0; y < meta.height; y += 844) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(250);
    const actual = await page.evaluate(() => window.scrollY);
    const file = String(tiles.length).padStart(3, "0") + ".png";
    await page.screenshot({ path: path.join(dir, file) });
    tiles.push({ y: actual, file });
  }
  meta.tiles = tiles;
  fs.writeFileSync(path.join(OUT, name + ".json"), JSON.stringify(meta, null, 1));
  console.log(name, meta.height, tiles.length, "tiles");
}

// Header in its solid (scrolled) state, drawn over the scrolling page in the reel
await page.goto(SITE + "/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 600));
await sleep(600);
await page.screenshot({ path: path.join(OUT, "header.png"), clip: { x: 0, y: 0, width: 390, height: 74 } });

await full("/", "home", ["#destinations", "#trips", "#vehicles", "#families", "#gallery", "#faq", "#plan"]);
await full("/trips", "trips");
await full("/trips/hunza-skardu", "trip", ["#plan"]);

await browser.close();
