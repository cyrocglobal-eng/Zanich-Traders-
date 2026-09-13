import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const runtime = "nodejs";
export const alt =
  "Zanich General Traders — Printing, Branding & Promotional Products, Nairobi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const photo = await readFile(
    path.join(process.cwd(), "public/images/hero-merch.jpg"),
  );
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0b",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 60,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "57%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: 35,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: "#ff4b42" }}>
            ZANICH
          </div>
          <div style={{ fontSize: 19, letterSpacing: 4 }}>GENERAL TRADERS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 55, fontWeight: 800, lineHeight: 1.05 }}>
            Make your brand impossible to ignore.
          </div>
          <div style={{ fontSize: 23, marginTop: 22, color: "#ddd" }}>
            Printing · Branding · Promotional Products
          </div>
        </div>
        <div style={{ fontSize: 23 }}>
          Keekorok Road, Nairobi · 0707 293 570
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/jpeg;base64,${photo.toString("base64")}`}
        width={450}
        height={510}
        alt=""
        style={{ objectFit: "cover", borderRadius: 24 }}
      />
    </div>,
    size,
  );
}
