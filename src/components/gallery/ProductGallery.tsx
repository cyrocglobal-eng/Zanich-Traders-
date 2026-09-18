"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Expand, Search } from "lucide-react";
import { galleryCategories, galleryItems, type GalleryCategory } from "@/content/gallery";
import { GalleryActions } from "./GalleryActions";
import { GalleryThumbnail } from "./GalleryThumbnail";
import styles from "./gallery.module.css";

const BATCH_SIZE = 12;
const GalleryDialog = dynamic(() => import("./GalleryDialog"), {
  ssr: false,
  loading: () => <p role="status" className={styles.loading}>Opening gallery…</p>,
});

export function ProductGallery({ canSubmit }: { canSubmit: boolean }) {
  const [category, setCategory] = useState<GalleryCategory>("All work");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<"image" | "quote">("image");
  const grid = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const items = galleryItems.filter(item =>
    (category === "All work" || item.category === category) &&
    (!search || `${item.title} ${item.alt} ${item.category}`.toLowerCase().includes(search))
  );
  const visible = items.slice(0, visibleCount);

  function resetSelection() {
    setVisibleCount(BATCH_SIZE);
    setSelected(null);
  }
  function open(index: number, nextMode: "image" | "quote") {
    setMode(nextMode);
    setSelected(index);
  }
  function showMore() {
    const firstNew = visible.length;
    setVisibleCount(count => count + BATCH_SIZE);
    // Continue keyboard navigation at the first newly revealed item.
    requestAnimationFrame(() => {
      grid.current?.querySelectorAll<HTMLButtonElement>("button[data-inspect]")[firstNew]?.focus({ preventScroll: true });
    });
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span>Find a design or product</span>
          <span className={styles.searchInput}>
            <Search size={18} aria-hidden="true" />
            <input type="search" value={query} placeholder="Try T-shirt, mug, cap or signage"
              onChange={event => { setQuery(event.target.value); resetSelection(); }} />
          </span>
        </label>
        <p className={styles.collectionNote}>{galleryItems.length} examples to explore.<br />Open any image for a closer look or a quote.</p>
      </div>
      <div role="group" aria-label="Filter portfolio by category" className={styles.filters}>
        {galleryCategories.map(label => (
          <button type="button" key={label} aria-pressed={category === label} aria-controls="portfolio-grid"
            onClick={() => { setCategory(label); resetSelection(); }}>
            {label}
          </button>
        ))}
      </div>
      <div className={styles.context}>
        <p>Product photos, design previews and supplied references.</p>
        <p role="status" aria-live="polite">Showing {visible.length} of {items.length} {items.length === 1 ? "example" : "examples"}</p>
      </div>
      <div id="portfolio-grid" ref={grid} className={styles.grid}>
        {visible.map((item, index) => (
          <article key={item.id} className={styles.card}>
            <button type="button" data-inspect className={styles.imageButton} onClick={() => open(index, "image")}
              aria-label={`View ${item.title}`} aria-haspopup="dialog">
              <GalleryThumbnail item={item} />
              <span className={styles.kind}>{item.kind}</span>
              <span className={styles.expand}><Expand size={18} aria-hidden="true" /></span>
            </button>
            <div className={styles.cardBody}>
              <p className={styles.category}>{item.category}</p>
              <h3>{item.title}</h3>
              <GalleryActions item={item} onQuote={() => open(index, "quote")} />
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && (
        <div className={styles.empty}>
          <h3>No matching examples</h3>
          <p>Try another search or explore the full collection.</p>
          <button type="button" className="btn-dark" onClick={() => { setQuery(""); setCategory("All work"); resetSelection(); }}>Clear filters</button>
        </div>
      )}
      {visible.length < items.length && (
        <div className={styles.more}>
          <button type="button" className="btn-dark" aria-controls="portfolio-grid" onClick={showMore}>
            Show {Math.min(BATCH_SIZE, items.length - visible.length)} more examples
          </button>
          <p>{items.length - visible.length} more to explore</p>
        </div>
      )}
      {selected !== null && (
        <GalleryDialog items={items} index={selected} mode={mode} onIndex={setSelected}
          onQuote={() => setMode("quote")} onClose={() => setSelected(null)} canSubmit={canSubmit} />
      )}
    </div>
  );
}
