import { createClient } from '@/lib/supabase/server';
import type { ProductCard, ProductVariant, ProductImage } from '../types';

export type { ProductCard, ProductVariant, ProductImage };

const PRODUCT_SELECT = `
  *,
  product_variants (id, name, sku, price_cents, compare_at_price_cents, stock, position),
  product_images (id, storage_path, alt_text, position)
` as const;

export async function getPublishedProducts(categoryId?: string): Promise<ProductCard[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`getPublishedProducts: ${error.message}`);

  return (data ?? []).map(normalizeProduct);
}

export async function getFeaturedProducts(limit = 3): Promise<ProductCard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getFeaturedProducts: ${error.message}`);
  return (data ?? []).map(normalizeProduct);
}

// Pure helpers (re-exported from utils so callers that import from here still work)
export { getMinPrice, isInStock } from '../utils/product-helpers';

// Internal

function normalizeProduct(raw: ProductCard): ProductCard {
  return {
    ...raw,
    product_variants: (raw.product_variants ?? []).sort((a, b) => a.position - b.position),
    product_images: (raw.product_images ?? []).sort((a, b) => a.position - b.position),
  };
}
