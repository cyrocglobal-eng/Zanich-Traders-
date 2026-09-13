import assets from "./gallery-assets.json";

export const galleryCategories = ["All work", "Custom Embroidery", "Large Format Signage", "Promotional Merchandise", "Sublimation", "Apparel"] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryItem = (typeof assets)[number];
export const galleryItems: GalleryItem[] = assets;
