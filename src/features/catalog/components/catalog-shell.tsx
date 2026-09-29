'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Route } from 'next';
import { ProductCard } from './product-card';
import { Pagination } from './pagination';
import type { ProductCard as ProductCardType } from '../types';
import type { Category } from '../queries/get-categories';

type CatalogCounts = {
  total: number;
  byCategory: Record<string, number>;
};

type Props = {
  products: ProductCardType[];
  categories: Category[];
  counts: CatalogCounts;
  currentPage: number;
  totalPages: number;
  activeCategory: Category | null;
};

export function CatalogShell({
  products,
  categories,
  counts,
  currentPage,
  totalPages,
  activeCategory,
}: Props) {
  const router = useRouter();

  const selectTab = useCallback(
    (slug: string | null) => {
      const url = slug ? `/tienda?categoria=${slug}` : '/tienda';
      router.replace(url as Route, { scroll: false });
    },
    [router],
  );

  return (
    <>
      {/* Tabs de filtro */}
      {categories.length > 0 && (
        <nav className="mb-12 flex flex-wrap gap-1.5" aria-label="Categorías">
          <Tab
            label="Todos"
            count={counts.total}
            active={!activeCategory}
            onClick={() => selectTab(null)}
          />
          {categories.map((cat) => (
            <Tab
              key={cat.id}
              label={cat.name}
              count={counts.byCategory[cat.id] ?? 0}
              active={activeCategory?.id === cat.id}
              onClick={() => selectTab(cat.slug)}
            />
          ))}
        </nav>
      )}

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-muted py-24 text-center text-sm">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div
          key={`${activeCategory?.slug ?? 'all'}-${currentPage}`}
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="catalog-card-enter"
              style={{ '--card-delay': `${Math.min(i, 8) * 30}ms` } as React.CSSProperties}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          categorySlug={activeCategory?.slug}
        />
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
      className={`group flex items-center gap-2 border px-4 py-2 text-xs font-medium transition-all duration-200 ${
        active
          ? 'border-primary bg-primary text-surface'
          : 'border-border text-ink hover:border-primary hover:text-primary bg-transparent'
      }`}
    >
      {label}
      <span
        className={`inline-flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-medium tabular-nums transition-colors ${
          active
            ? 'bg-surface/20 text-surface'
            : 'group-hover:bg-primary/10 group-hover:text-primary bg-primary/5 text-muted'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
