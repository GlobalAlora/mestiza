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

export async function getPublishedProductsPage(opts: {
  categoryId?: string;
  page: number;
  pageSize: number;
}): Promise<{ products: ProductCard[]; total: number }> {
  const supabase = await createClient();
  const { categoryId, page, pageSize } = opts;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(`getPublishedProductsPage: ${error.message}`);

  return {
    products: (data ?? []).map(normalizeProduct),
    total: count ?? 0,
  };
}

export async function getCatalogCounts(): Promise<{
  total: number;
  byCategory: Record<string, number>;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('category_id')
    .eq('status', 'published');

  if (error) throw new Error(`getCatalogCounts: ${error.message}`);

  const rows = data ?? [];
  const byCategory: Record<string, number> = {};
  for (const row of rows) {
    if (row.category_id) {
      byCategory[row.category_id] = (byCategory[row.category_id] ?? 0) + 1;
    }
  }

  return { total: rows.length, byCategory };
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  limit = 3,
): Promise<ProductCard[]> {
  const supabase = await createClient();

  // Prefer same category
  if (categoryId) {
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if ((data?.length ?? 0) > 0) return (data ?? []).map(normalizeProduct);
  }

  // Fallback: any published products except current
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);
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
