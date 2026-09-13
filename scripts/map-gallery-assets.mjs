import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

// Curated from the owner's 68 supplied images, sorted by original filename.
const selection = [
  [62,"kenya-polo","Kenya-inspired polo","Apparel","Product photo","promotional-merchandise","Black, white and red polo with a Kenyan flag and patterned front"],
  [29,"branded-pens","Logo pens","Promotional Merchandise","Product photo","promotional-merchandise","Blue and white promotional pens with printed business lettering"],
  [27,"logo-cap","Embroidered cap","Custom Embroidery","Product photo","promotional-merchandise","Navy cap with a blue and green stitched logo"],
  [31,"logo-mug","Branded ceramic mug","Sublimation","Product photo","sublimation","White ceramic mug with a blue and green company logo"],
  [38,"printed-safety-vest","Printed safety vest","Apparel","Product photo","promotional-merchandise","High-visibility yellow vest with bold black AD ENERGY lettering"],
  [22,"teardrop-banner","Teardrop banner concept","Large Format Signage","Design preview","large-format-printing","Cream teardrop banner design with green and red motorsport branding"],
  [34,"branded-notebooks","Branded notebooks","Promotional Merchandise","Product photo","promotional-merchandise","Kraft-cover notebooks with printed organisation logos and blue lettering"],
  [55,"patterned-shirts","All-over patterned shirts","Sublimation","Product photo","sublimation","Colourful patterned shirts laid out together in a production workspace"],
  [18,"hospitality-polo","Hospitality logo polo","Custom Embroidery","Product photo","promotional-merchandise","Navy polo with a small orange and white hospitality logo on the chest"],
  [16,"lectern-branding","Lectern branding concept","Large Format Signage","Design preview","large-format-printing","Wooden lectern design with a rectangular logo panel on the front"],
  [56,"field-vest-design","Branded field vest concept","Apparel","Design preview","promotional-merchandise","Front and back design views of a beige utility vest with partner logos"],
  [35,"personalised-mugs","Personalised mug designs","Sublimation","Design preview","sublimation","Black and white mugs with Best Dad Ever and Best Mom Ever lettering"],
];
const files=(await readdir("..")).filter(f=>/\.jpe?g$/i.test(f)).sort();
if(files.length!==68) throw new Error("Source inventory changed; review the asset mapping before regenerating.");
await mkdir("public/images/gallery",{recursive:true});
const assets=[], provenance=[];
for(const [index,id,title,category,kind,service,description] of selection){
 const source=files[index];
 const bytes=await readFile(`../${source}`);
 const output=await sharp(bytes).rotate().resize({width:1600,height:1600,fit:"inside",withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
 await writeFile(`public/images/gallery/${id}.webp`,output.data);
 assets.push({id,title,category,kind,service,src:`/images/gallery/${id}.webp`,width:output.info.width,height:output.info.height,alt:`${description} — Zanich portfolio, Nairobi, Kenya.`});
 provenance.push({id,source,sourceSha256:createHash("sha256").update(bytes).digest("hex"),bytes:output.data.length,width:output.info.width,height:output.info.height});
}
await writeFile("src/content/gallery-assets.json",JSON.stringify(assets,null,2)+"\n");
await writeFile("docs/gallery-provenance.json",JSON.stringify(provenance,null,2)+"\n");
console.log(`${assets.length} assets mapped; ${(provenance.reduce((n,a)=>n+a.bytes,0)/1024).toFixed(0)} KB total. Originals unchanged.`);
