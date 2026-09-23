'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { Route } from 'next';
import { ProductCard } from './product-card';
import type { ProductCard as ProductCardType } from '../types';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  products: ProductCardType[];
  categories: Category[];
};

export function CatalogShell({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeSlug = searchParams.get('categoria');
  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === activeSlug) ?? null,
    [categories, activeSlug],
  );

  const filtered = useMemo(
    () => (activeCategory ? products.filter((p) => p.category_id === activeCategory.id) : products),
    [products, activeCategory],
  );

  const selectTab = useCallback(
    (slug: string | null) => {
      const url = slug ? `/tienda?categoria=${slug}` : '/tienda';
      router.replace(url as Route, { scroll: false });
    },
    [router],
  );

  const countForSlug = useCallback(
    (categoryId: string) => products.filter((p) => p.category_id === categoryId).length,
    [products],
  );

  return (
    <>
      {/* Tabs de filtro */}
      {categories.length > 0 && (
        <nav className="mb-12 flex flex-wrap gap-1.5" aria-label="Categorías">
          <Tab
            label="Todos"
            count={products.length}
            active={!activeSlug}
            onClick={() => selectTab(null)}
          />
          {categories.map((cat) => (
            <Tab
              key={cat.id}
              label={cat.name}
              count={countForSlug(cat.id)}
              active={activeSlug === cat.slug}
              onClick={() => selectTab(cat.slug)}
            />
          ))}
        </nav>
      )}

      {/* Grid con animación stagger en cada cambio de categoría */}
      {filtered.length === 0 ? (
        <p className="text-muted py-24 text-center text-sm">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div
          key={activeSlug ?? '__all'}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="catalog-card-enter"
              style={{ '--card-delay': `${i * 45}ms` } as React.CSSProperties}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Tab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-2 border px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
        active
          ? 'border-primary bg-primary text-surface'
          : 'border-border text-ink hover:border-primary hover:text-primary bg-transparent'
      }`}
    >
      {label}
      <span
        className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums transition-colors ${
          active
            ? 'bg-surface/20 text-surface'
            : 'group-hover:bg-primary/10 group-hover:text-primary bg-zinc-100 text-zinc-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
