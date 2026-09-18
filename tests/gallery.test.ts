import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assets from '../src/content/gallery-assets.json';
import provenance from '../docs/gallery-provenance.json';
import { services } from '../src/content/services';

test('every supplied portfolio original is mapped once and keeps its source hash', () => {
  const originals = readdirSync('assets/portfolio-originals').filter(name => name.endsWith('.jpeg'));
  assert.equal(assets.length, originals.length);
  assert.equal(new Set(assets.map(item => item.id)).size, assets.length);
  assert.equal(new Set(provenance.map(item => item.sourceSha256)).size, assets.length);
  for (const source of originals) {
    const path = `assets/portfolio-originals/${source}`;
    const entry = provenance.find(item => item.source === path);
    assert.ok(entry, `Missing source ${source}`);
    assert.equal(entry.sourceSha256, createHash('sha256').update(readFileSync(path)).digest('hex'));
    assert.ok(assets.some(item => item.id === entry.id));
  }
});

test('portfolio assets have local renditions, useful metadata and valid quote destinations', () => {
  for (const item of assets) {
    assert.ok(item.title.length > 5);
    assert.match(item.alt, /Nairobi, Kenya/);
    assert.ok(services.some(service => service.slug === item.service));
    assert.ok(item.width <= 1600 && item.height <= 1600);
    assert.ok(existsSync(`public${item.src}`), item.src);
    assert.ok(item.thumbnails.length > 0);
    let lastWidth = 0;
    for (const thumb of item.thumbnails) {
      assert.match(thumb.src, /^\/images\/gallery\/thumbs\/[a-z0-9-]+\.webp$/);
      assert.ok(existsSync(`public${thumb.src}`), thumb.src);
      assert.ok(thumb.width > lastWidth && thumb.width <= 720);
      lastWidth = thumb.width;
    }
  }
});
