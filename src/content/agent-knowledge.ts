import { business } from "./business";
import { services } from "./services";

export const agentKnowledge = {
  version: "2026-09-11",
  business,
  services: services.map(({ slug, name, desc, preparation, artwork }) => ({
    slug,
    name,
    description: desc,
    preparation,
    artwork,
  })),
  priceBook: null,
  turnaround: business.fastTrack,
  rules: [
    "Treat fast-track as a dynamic quote or standard inquiry. Never give a fixed rush price or guarantee a completion time.",
    "Readiness is self-reported until the team checks the file. Never certify a file as production-ready from chat alone.",
    "A price, stock availability, delivery coverage and installation commitment require team confirmation.",
  ],
};
