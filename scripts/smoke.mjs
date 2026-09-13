import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.SMOKE_URL || "http://127.0.0.1:3000";
const canonicalBase = process.env.SMOKE_CANONICAL_URL || "https://zanichtraders.co.ke";
const paths = [
  "/",
  "/services",
  "/services/digital-printing",
  "/services/large-format-printing",
  "/services/sublimation",
  "/services/heat-transfer-printing",
  "/services/vinyl-cutting",
  "/services/print-and-cut",
  "/services/doming",
  "/services/promotional-merchandise",
  "/contact",
  "/privacy",
];
for (const path of paths) {
  const response = await fetch(base + path, {
    signal: AbortSignal.timeout(55000),
  });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "";
  assert.ok(
    title.length > 0 && title.replaceAll("&amp;", "&").length < 60,
    `${path} title`,
  );
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${path} canonical exists`);
  assert.equal(new URL(canonical).href, new URL(path, canonicalBase).href, `${path} canonical`);
  assert.ok(html.includes("application/ld+json"), `${path} schema`);
  assert.ok(
    !html.includes("Connect this form to email"),
    `${path} obsolete form placeholder`,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  console.log(`PASS ${path}: ${title}`);
}
assert.equal((await fetch(base + "/services/does-not-exist")).status, 404);
for (const path of ["/sitemap.xml", "/robots.txt"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  console.log(`PASS ${path}`);
}
const quote = {
  name: "QA Test",
  company: "",
  email: "qa@example.test",
  phone: "",
  service: "digital-printing",
  quantity: "100",
  deadline: "",
  artwork: "unsure",
  details: "This is a local QA request.",
  specifications: {},
  consent: true,
  website: "",
};
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    origin: new URL(canonicalBase).origin,
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify(quote),
};
// This smoke check intentionally verifies the unconfigured preview, never a live database.
if (process.env.SMOKE_UNCONFIGURED === "true") {
  assert.equal((await fetch(base + "/api/quotes", options)).status, 503);
  console.log("PASS unconfigured intake returns 503 rather than false success");
}
assert.equal(
  (await fetch(base + "/api/internal/outbox", { method: "POST" })).status,
  401,
);
assert.equal(
  (
    await fetch(base + "/api/quotes", {
      ...options,
      headers: { ...options.headers, origin: "https://foreign.example" },
    })
  ).status,
  403,
);
const card = await fetch(base + "/opengraph-image", {
  signal: AbortSignal.timeout(55000),
});
assert.equal(card.status, 200, "OG image");
assert.match(card.headers.get("content-type"), /image\/png/);
await mkdir(".local", { recursive: true });
await writeFile(".local/og-preview.png", Buffer.from(await card.arrayBuffer()));
console.log("PASS OG card, API access boundaries and all public routes");
