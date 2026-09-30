import test from "node:test";
import assert from "node:assert/strict";
import { services } from "../src/content/services";
import { site } from "../src/content/site";
import { whatsappLink } from "../src/lib/whatsapp";
import {
  serviceMetadata,
  homeTitle,
  homeDescription,
} from "../src/lib/seo/metadata";
import { localBusinessSchema, serializeJsonLd } from "../src/lib/seo/schema";
import { policyReply, decisionReply } from "../src/server/agent/policy";
import { readRequest } from "../src/server/security/requests";

test("WhatsApp encodes customer text without changing the recipient", () => {
  const text = "Name: A & B\nPrint & Cut: 25 + 50? #label";
  const link = new URL(whatsappLink(text));
  assert.equal(link.pathname, "/254707293570");
  assert.equal(link.searchParams.get("text"), text);
});
test("all services and client stories remain in the source catalogue", () => {
  assert.equal(services.length, 8);
  assert.deepEqual(
    services.map((item) => item.name),
    site.services.items.map((item) => item.name),
  );
  assert.deepEqual(
    site.testimonials.items.map((item) => item.author),
    ["Ticketsasa", "Kikao Chill & Vibe"],
  );
});
test("SEO titles and descriptions fit the approved limits and canonicals use the chosen domain", () => {
  assert.ok(homeTitle.length < 60 && homeDescription.length < 160);
  for (const service of services) {
    const meta = serviceMetadata(service);
    assert.ok(
      (meta.title as { absolute: string }).absolute.length < 60,
      service.slug,
    );
    assert.ok(
      meta.description!.length < 160,
      `${service.slug}: ${meta.description!.length}`,
    );
    assert.equal(
      meta.alternates?.canonical,
      `https://zanichtraders.co.ke/services/${service.slug}`,
    );
  }
});
test("schema includes the actual location and hours, and script termination is escaped", () => {
  const schema = localBusinessSchema();
  assert.equal(schema["@type"], "LocalBusiness");
  assert.equal(schema.openingHoursSpecification[0].opens, "08:30");
  assert.equal(schema.openingHoursSpecification[1].closes, "13:00");
  assert.equal(schema.address.addressLocality, "Nairobi");
  assert.ok(
    !serializeJsonLd({ text: "</script><script>alert(1)</script>" }).includes(
      "<",
    ),
  );
});
test("pricing and rush requests escalate without an invented price or guarantee", () => {
  const reply = policyReply("How much for 100 mugs tomorrow?");
  assert.equal(reply?.handoff, "quote");
  assert.match(reply!.reply, /confirmation/);
  const decision = decisionReply({
    intent: "pricing",
    serviceSlug: "unknown-service",
    summary: "Customer requests a discount",
    needsHuman: true,
    nextQuestion: "quantity",
  });
  assert.equal(decision.handoff, "team");
  assert.ok(!decision.reply.includes("500"));
  assert.ok(decision.reply.includes("tailored quote"));
  assert.equal(policyReply("I have a complaint")?.handoff, "feedback");
});
test("request guard rejects foreign origins and oversized bodies", async () => {
  const make = (body: string, origin: string) =>
    new Request("https://zanichtraders.co.ke/api/quotes", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body,
    });
  await assert.rejects(
    readRequest(make("{}", "https://attacker.test")),
    /Zanich website/,
  );
  await assert.rejects(
    readRequest(
      make(
        JSON.stringify({ text: "x".repeat(100) }),
        "https://zanichtraders.co.ke",
      ),
      20,
    ),
    /shorten/,
  );
  assert.deepEqual(
    await readRequest(make("{}", "https://zanichtraders.co.ke")),
    {},
  );
});
