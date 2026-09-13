import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = process.env.SMOKE_URL || "http://127.0.0.1:3000";
const assets = JSON.parse(await readFile(new URL("../src/content/gallery-assets.json", import.meta.url), "utf8"));
const home = await fetch(base, { signal: AbortSignal.timeout(30000) });
assert.equal(home.status, 200);
assert.match(home.headers.get("x-robots-tag") || "", /noindex/);
const html = await home.text();
assert.ok(html.includes("wa.me/254707293570"));
for (const item of assets) {
  const response = await fetch(new URL(item.src, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, item.id);
  assert.match(response.headers.get("content-type"), /image\/webp/);
  assert.ok((await response.arrayBuffer()).byteLength > 0, item.id);
}
const optimized = await fetch(`${base}/_next/image?url=${encodeURIComponent(assets[0].src)}&w=640&q=75`, { signal: AbortSignal.timeout(60000) });
assert.equal(optimized.status, 200, "image optimization and cache write");
assert.match(optimized.headers.get("content-type"), /image\//);
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]).filter((src) => src.startsWith("/_next/"));
assert.ok(scripts.length > 0);
for (const src of scripts) assert.equal((await fetch(new URL(src, base))).status, 200, src);
console.log(`PASS preview noindex, WhatsApp, ${assets.length} gallery assets, image optimization, and ${scripts.length} JavaScript bundles`);
