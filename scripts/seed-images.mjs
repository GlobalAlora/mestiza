/**
 * Seed script — downloads wine placeholder images from Pexels and uploads
 * them to Supabase Storage, creating product_images records for every
 * product that doesn't have one yet.
 *
 * Run: node scripts/seed-images.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'],
);

// One representative image per category (Pexels free license)
const CATEGORY_IMAGES = {
  'vinos-tintos': [
    'https://images.pexels.com/photos/9145965/pexels-photo-9145965.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  'vinos-blancos': [
    'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5184784/pexels-photo-5184784.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  'vinos-rosados': [
    'https://images.pexels.com/photos/5740986/pexels-photo-5740986.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/9145965/pexels-photo-9145965.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  'espumantes': [
    'https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/20579556/pexels-photo-20579556.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  'cajas': [
    'https://images.pexels.com/photos/26834216/pexels-photo-26834216.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/9145965/pexels-photo-9145965.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
};
const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/9145965/pexels-photo-9145965.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/20579556/pexels-photo-20579556.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/26834216/pexels-photo-26834216.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// Cache downloaded images so we don't re-fetch the same URL
const imageCache = new Map();

async function fetchImage(url) {
  if (imageCache.has(url)) return imageCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  imageCache.set(url, buffer);
  return buffer;
}

async function main() {
  // 1. Load all products that don't have images yet
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, slug, category_id, categories(slug)')
    .eq('status', 'published')
    .order('created_at');

  if (prodErr) throw prodErr;
  console.log(`Found ${products.length} published products`);

  // 2. Find which products already have images
  const { data: existingImages } = await supabase
    .from('product_images')
    .select('product_id');
  const withImages = new Set((existingImages ?? []).map((r) => r.product_id));

  const toProcess = products.filter((p) => !withImages.has(p.id));
  console.log(`${toProcess.length} products need images (${withImages.size} already have them)\n`);

  if (toProcess.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  // 3. Pre-fetch all unique images
  const allUrls = new Set([...Object.values(CATEGORY_IMAGES).flat(), ...FALLBACK_IMAGES]);
  console.log(`Pre-fetching ${allUrls.size} unique images...`);
  for (const url of allUrls) {
    try {
      await fetchImage(url);
      process.stdout.write('.');
    } catch {
      process.stdout.write('x');
    }
  }
  console.log('\n');

  // 4. Upload + insert for each product
  let ok = 0;
  let fail = 0;

  for (const product of toProcess) {
    const catSlug = product.categories?.slug ?? '';
    const urls = CATEGORY_IMAGES[catSlug] ?? FALLBACK_IMAGES;

    // Pick 2 images per product (main + secondary)
    const imagesToUpload = urls.length >= 2 ? [urls[0], urls[1]] : [urls[0], FALLBACK_IMAGES[1]];

    try {
      const imageRecords = [];

      for (let i = 0; i < imagesToUpload.length; i++) {
        const url = imagesToUpload[i];
        const storagePath = `${product.id}/${String(i + 1).padStart(2, '0')}.jpg`;

        // Check if already uploaded
        const { data: existing } = await supabase.storage
          .from('products')
          .list(product.id);
        const filename = `${String(i + 1).padStart(2, '0')}.jpg`;
        const alreadyUploaded = (existing ?? []).some((f) => f.name === filename);

        if (!alreadyUploaded) {
          const buffer = imageCache.get(url);
          if (!buffer) continue;

          const { error: uploadErr } = await supabase.storage
            .from('products')
            .upload(storagePath, buffer, {
              contentType: 'image/jpeg',
              upsert: false,
            });

          if (uploadErr && !uploadErr.message.includes('already exists')) {
            throw uploadErr;
          }
        }

        imageRecords.push({
          product_id: product.id,
          storage_path: storagePath,
          alt_text: `${product.name} — imagen ${i + 1}`,
          position: i,
        });
      }

      if (imageRecords.length > 0) {
        const { error: insertErr } = await supabase
          .from('product_images')
          .insert(imageRecords);
        if (insertErr) throw insertErr;
      }

      console.log(`✓ ${product.name}`);
      ok++;
    } catch (err) {
      console.error(`✗ ${product.name}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
