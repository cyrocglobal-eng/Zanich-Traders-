import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import type { GalleryItem } from "@/content/gallery";
import styles from "./gallery.module.css";

export function GalleryActions({item,onQuote}:{item:GalleryItem;onQuote:()=>void}) {
  return <div className={styles.actions}>
    <button type="button" onClick={onQuote} className={styles.quote} aria-label={`Request quote for ${item.title}`}>Request Quote <ArrowUpRight size={16} aria-hidden="true" /></button>
    <a href={whatsappLink(`Hello Zanich, I'd like to discuss ${item.title} from your gallery (reference: ${item.id}). Please advise on customisation, quantity and pricing.`)} target="_blank" rel="noopener noreferrer" data-placement="gallery" className={styles.whatsapp} aria-label={`Chat on WhatsApp about ${item.title}`}><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
  </div>;
}
