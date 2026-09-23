export type VariantPrice = { price_cents: number; stock: number };

export function getMinPrice(variants: VariantPrice[]): number {
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => v.price_cents));
}

export function isInStock(variants: VariantPrice[]): boolean {
  return variants.some((v) => v.stock > 0);
}
