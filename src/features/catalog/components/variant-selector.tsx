'use client';

import { useState } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import type { Database } from '@/lib/supabase/types';
import { useCartStore } from '@/features/cart/store';

type Variant = Pick<
  Database['public']['Tables']['product_variants']['Row'],
  'id' | 'name' | 'sku' | 'price_cents' | 'compare_at_price_cents' | 'stock'
>;

type Props = {
  variants: Variant[];
  productName: string;
  productId: string;
  slug: string;
  imagePath: string | null;
};

export function VariantSelector({ variants, productName, productId, slug, imagePath }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const addItem = useCartStore((s) => s.addItem);

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const inStock = (selected?.stock ?? 0) > 0;
  const lowStock = inStock && (selected?.stock ?? 0) <= 5;

  function handleAddToCart() {
    if (!selected || !inStock) return;
    addItem({
      variantId: selected.id,
      productId,
      name: productName,
      variantName: selected.name,
      sku: selected.sku,
      price: selected.price_cents,
      imagePath,
      slug,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Variant selector */}
      {variants.length > 1 && (
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
            Presentación
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Elegí una presentación">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                disabled={v.stock === 0}
                aria-pressed={v.id === selectedId}
                className={cn(
                  'border px-4 py-2 text-xs font-medium tracking-wide transition-all',
                  v.id === selectedId
                    ? 'border-primary bg-primary text-surface'
                    : 'border-border text-ink hover:border-primary',
                  v.stock === 0 && 'cursor-not-allowed line-through opacity-40',
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      {selected && (
        <div className="flex items-baseline gap-3">
          <span className="text-primary font-serif text-3xl">
            {formatPrice(selected.price_cents)}
          </span>
          {selected.compare_at_price_cents &&
            selected.compare_at_price_cents > selected.price_cents && (
              <span className="text-muted text-sm line-through">
                {formatPrice(selected.compare_at_price_cents)}
              </span>
            )}
        </div>
      )}

      {/* Low stock notice */}
      {lowStock && (
        <p className="text-accent text-xs font-medium" role="status">
          Últimas {selected?.stock} unidades disponibles.
        </p>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={!inStock}
        aria-label={
          inStock
            ? `Agregar ${productName}${selected ? ` — ${selected.name}` : ''} al carrito`
            : 'Sin stock disponible'
        }
        className="bg-primary text-surface w-full py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity enabled:hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {inStock ? 'Agregar al carrito' : 'Sin stock'}
      </button>
    </div>
  );
}
