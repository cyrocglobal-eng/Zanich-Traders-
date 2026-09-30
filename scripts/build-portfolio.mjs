import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const readJson = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const catalogue = await readJson('scripts/portfolio-catalogue.json');
const previous = await readJson('docs/gallery-provenance.json');
const current = await readJson('src/content/gallery-assets.json');
const assets = [], provenance = [], seen = new Set();
await mkdir('public/images/gallery/thumbs', {recursive:true});
for (const [number, title, category, description, kind = 'Design preview'] of catalogue) {
  const source = `assets/portfolio-originals/${number}.jpeg`;
  const bytes = await readFile(source);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (seen.has(hash)) throw new Error(`Repeated source: ${source}`);
  seen.add(hash);
  const existing = previous.find(item => item.sourceSha256 === hash);
  const id = existing?.id ?? `work-${String(number).padStart(2,'0')}-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}`;
  const full = await sharp(bytes).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
  const src = `/images/gallery/${id}.webp`;
  await writeFile(`public${src}`,full.data);
  const thumbnails=[];
  for(const width of [360,720]) {
    const result=await sharp(bytes).rotate().resize({width,height:width,fit:"inside",withoutEnlargement:true}).webp({quality:76}).toBuffer({resolveWithObject:true});
    if(thumbnails.some(t=>t.width===result.info.width)) continue;
    const path=`/images/gallery/thumbs/${id}-${result.info.width}.webp`;
    await writeFile(`public${path}`,result.data);
    thumbnails.push({src:path,width:result.info.width,bytes:result.data.length});
  }
  const service = category==='Large Format Signage'?'large-format-printing':category==='Sublimation'?'sublimation':category==='Print & Packaging'?(number===49?'print-and-cut':'digital-printing'):'promotional-merchandise';
  assets.push({id,title,category,kind,service,src,width:full.info.width,height:full.info.height,alt:`${description} — Zanich portfolio, Nairobi, Kenya.`,thumbnails});
  provenance.push({id,source,sourceSha256:hash,bytes:full.data.length,width:full.info.width,height:full.info.height});
}
// Keep familiar featured work first, followed by the rest of the complete collection.
assets.sort((a,b)=>{
 const rank=id=>{const index=current.findIndex(x=>x.id===id);return index<0?1000:index;};
 return rank(a.id)-rank(b.id);
});
await writeFile('src/content/gallery-assets.json',JSON.stringify(assets,null,2)+'\n');
await writeFile('docs/gallery-provenance.json',JSON.stringify(provenance,null,2)+'\n');
console.log(JSON.stringify({images:assets.length,fullBytes:provenance.reduce((n,a)=>n+a.bytes,0),thumbnailBytes:assets.reduce((n,a)=>n+a.thumbnails.at(-1).bytes,0),initial12ThumbnailBytes:assets.slice(0,12).reduce((n,a)=>n+a.thumbnails.at(-1).bytes,0)}));
