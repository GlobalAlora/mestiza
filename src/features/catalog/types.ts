// Fase 2: generado desde supabase/types.ts
// Fase 3: componentes de catálogo (ProductCard, ProductGrid, CategoryCard)

export type ProductStatus = 'draft' | 'published' | 'archived';

export type WineAttributes = {
  varietal: string;
  vintage_year: number;
  region: string;
  altitude_masl: number;
  tasting_notes: string;
  pairing: string;
  alcohol_pct: number;
  producer: string;
};

export type MerchAttributes = {
  material?: string;
  sizes?: string[];
};

export type ProductAttributes = WineAttributes | MerchAttributes;
