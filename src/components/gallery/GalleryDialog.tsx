"use client";
import Image from "next/image";
import {useEffect,useRef} from "react";
import {ChevronLeft,ChevronRight,X} from "lucide-react";
import type {GalleryItem} from "@/content/gallery";
import {QuoteForm} from "@/components/quote/QuoteForm";
import {GalleryActions} from "./GalleryActions";
import styles from "./gallery.module.css";

export default function GalleryDialog({items,index,mode,onIndex,onQuote,onClose,canSubmit}:{items:GalleryItem[];index:number;mode:"image"|"quote";onIndex:(index:number)=>void;onQuote:()=>void;onClose:()=>void;canSubmit:boolean}) {
 const dialog=useRef<HTMLDialogElement>(null);
 const item=items[index];
 useEffect(()=>{
  const node=dialog.current;
  const opener=document.activeElement;
  const overflow=document.body.style.overflow;
  node?.showModal();
  document.body.style.overflow="hidden";
  return ()=>{node?.close();document.body.style.overflow=overflow;if(opener instanceof HTMLElement&&opener.isConnected)opener.focus();};
 },[]);
 const step=(direction:number)=>onIndex((index+direction+items.length)%items.length);
 return <dialog ref={dialog} className={styles.dialog} aria-labelledby="gallery-dialog-title" onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}} onKeyDown={event=>{if(mode!=="image"||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==="ArrowRight"){event.preventDefault();step(1);}if(event.key==="ArrowLeft"){event.preventDefault();step(-1);}}}>
  <div className={styles.dialogInner}>
   <header className={styles.dialogHeader}><div><p className={styles.category}>{mode==="image"?`${item.category} · ${item.kind}`:"Your project brief"}</p><h2 id="gallery-dialog-title">{mode==="image"?item.title:`Quote: ${item.title}`}</h2></div><button autoFocus type="button" onClick={onClose} aria-label="Close gallery" className={styles.iconButton}><X aria-hidden="true" /></button></header>
   {mode==="image"?<>
    <div className={styles.inspection}><Image key={item.id} src={item.src} alt={item.alt} unoptimized fill sizes="(max-width: 768px) 92vw, 960px" loading="eager" className={styles.fullImage}/></div>
    <div className={styles.dialogFooter}><div className={styles.navigation}><button className={styles.iconButton} type="button" aria-label="Previous image" onClick={()=>step(-1)} disabled={items.length<2}><ChevronLeft aria-hidden="true" /></button><span role="status" aria-live="polite">{index+1} / {items.length} · {item.title}</span><button className={styles.iconButton} type="button" aria-label="Next image" onClick={()=>step(1)} disabled={items.length<2}><ChevronRight aria-hidden="true" /></button></div><GalleryActions item={item} onQuote={onQuote}/></div>
   </>:<div className={styles.quoteBody}><QuoteForm key={item.id} id={`gallery-${item.id}`} canSubmit={canSubmit} initialService={item.service} initialDetails={`I'm interested in ${item.title} (gallery reference: ${item.id}). Please advise on customisation and pricing.`}/></div>}
  </div>
 </dialog>;
}
