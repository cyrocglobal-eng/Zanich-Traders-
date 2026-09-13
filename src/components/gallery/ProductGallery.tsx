"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useState} from "react";
import {Expand} from "lucide-react";
import {galleryCategories,galleryItems,type GalleryCategory} from "@/content/gallery";
import {GalleryActions} from "./GalleryActions";
import styles from "./gallery.module.css";
const GalleryDialog=dynamic(()=>import("./GalleryDialog"),{ssr:false,loading:()=> <p role="status" className={styles.loading}>Opening gallery…</p>});

export function ProductGallery({canSubmit}:{canSubmit:boolean}) {
 const [category,setCategory]=useState<GalleryCategory>("All work");
 const [selected,setSelected]=useState<number|null>(null);
 const [mode,setMode]=useState<"image"|"quote">("image");
 const items=category==="All work"?galleryItems:galleryItems.filter(item=>item.category===category);
 function open(index:number,nextMode:"image"|"quote"){setMode(nextMode);setSelected(index);}
 return <div className={styles.gallery}>
  <div role="group" aria-label="Filter portfolio by category" className={styles.filters}>{galleryCategories.map(label=><button type="button" key={label} aria-pressed={category===label} aria-controls="portfolio-grid" onClick={()=>{setCategory(label);setSelected(null);}}>{label}</button>)}</div>
  <div className={styles.context}><p>Product photos and design previews from our portfolio.</p><p role="status" aria-live="polite">{items.length} {items.length===1?"example":"examples"}</p></div>
  <div id="portfolio-grid" className={styles.grid}>{items.map((item,index)=><article key={item.id} className={styles.card}>
   <button type="button" className={styles.imageButton} onClick={()=>open(index,"image")} aria-label={`View ${item.title}`} aria-haspopup="dialog"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" loading="lazy" className={styles.cardImage}/><span className={styles.kind}>{item.kind}</span><span className={styles.expand}><Expand size={18} aria-hidden="true"/></span></button>
   <div className={styles.cardBody}><p className={styles.category}>{item.category}</p><h3>{item.title}</h3><GalleryActions item={item} onQuote={()=>open(index,"quote")}/></div>
  </article>)}</div>
  {selected!==null&&<GalleryDialog items={items} index={selected} mode={mode} onIndex={setSelected} onQuote={()=>setMode("quote")} onClose={()=>setSelected(null)} canSubmit={canSubmit}/>}
 </div>;
}
