import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type VariantRow = Database['public']['Tables']['product_variants']['Row'];
type ImageRow = Database['public']['Tables']['product_images']['Row'];

export type ProductVariant = Pick<
  VariantRow,
  'id' | 'name' | 'sku' | 'price_cents' | 'compare_at_price_cents' | 'stock' | 'position'
>;

export type ProductImage = Pick<ImageRow, 'id' | 'storage_path' | 'alt_text' | 'position'>;

export type ProductCard = ProductRow & {
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

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

// Helpers

function normalizeProduct(raw: ProductCard): ProductCard {
  return {
    ...raw,
    product_variants: (raw.product_variants ?? []).sort((a, b) => a.position - b.position),
    product_images: (raw.product_images ?? []).sort((a, b) => a.position - b.position),
  };
}

export function getMinPrice(variants: ProductVariant[]): number {
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => v.price_cents));
}

export function isInStock(variants: ProductVariant[]): boolean {
  return variants.some((v) => v.stock > 0);
}
