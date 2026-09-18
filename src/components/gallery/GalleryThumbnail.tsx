"use client";

import { useState } from "react";
import type { GalleryItem } from "@/content/gallery";
import styles from "./gallery.module.css";

export function GalleryThumbnail({ item }: { item: GalleryItem }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={styles.imageFallback}>Preview unavailable. Open the full image.</span>;
  return (
    // Prebuilt responsive WebPs avoid runtime image conversion on the EC2 server.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.thumbnails[0].src}
      srcSet={item.thumbnails.map(image => `${image.src} ${image.width}w`).join(", ")}
      sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 88px) / 2), (max-width: 1279px) calc((100vw - 128px) / 3), 384px"
      width={item.width}
      height={item.height}
      alt={item.alt}
      loading="lazy"
      decoding="async"
      className={styles.cardImage}
      onError={() => setFailed(true)}
    />
  );
}
