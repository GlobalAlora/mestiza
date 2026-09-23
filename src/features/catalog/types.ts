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
