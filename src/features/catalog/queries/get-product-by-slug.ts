import { createClient } from '@/lib/supabase/server';
import { createClient as createAnonClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import type { ProductVariant, ProductImage } from './get-products';

type ProductRow = Database['public']['Tables']['products']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

export type ProductDetail = ProductRow & {
  product_variants: (ProductVariant & { weight_grams: number | null })[];
  product_images: ProductImage[];
  categories: Pick<CategoryRow, 'id' | 'name' | 'slug'> | null;
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_variants (id, name, sku, price_cents, compare_at_price_cents, stock, weight_grams, position),
      product_images (id, storage_path, alt_text, position),
      categories (id, name, slug)
    `,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`getProductBySlug: ${error.message}`);
  }
  if (!data) return null;

  return {
    ...data,
    product_variants: (data.product_variants ?? []).sort((a, b) => a.position - b.position),
    product_images: (data.product_images ?? []).sort((a, b) => a.position - b.position),
  };
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  // Uses anon client without cookies — safe in generateStaticParams (no request context)
  const supabase = createAnonClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase.from('products').select('slug').eq('status', 'published');

  if (error) throw new Error(`getAllPublishedSlugs: ${error.message}`);
  return (data ?? []).map((r) => r.slug);
}
