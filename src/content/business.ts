import { site } from "./site";

export const business = {
  ...site.contact,
  name: site.name,
  timezone: "Africa/Nairobi",
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
    { days: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  fastTrack:
    "24-hour fast-track options are subject to the team's confirmation of artwork, materials, quantity and production capacity.",
  pricing:
    "Prices depend on quantity, dimensions, materials, artwork, finishing and deadline. The team provides a tailored quote; no public rate card is currently approved.",
} as const;
