'use client';

import Link from 'next/link';
import type { Route } from 'next';

type Props = {
  currentPage: number;
  totalPages: number;
  categorySlug?: string;
};

function pageUrl(page: number, categorySlug?: string): Route {
  const params = new URLSearchParams();
  if (categorySlug) params.set('categoria', categorySlug);
  if (page > 1) params.set('pagina', String(page));
  const qs = params.toString();
  return `/tienda${qs ? `?${qs}` : ''}` as Route;
}

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, categorySlug }: Props) {
  const pages = getPages(currentPage, totalPages);

  return (
    <nav className="mt-16 flex items-center justify-center gap-1" aria-label="Paginación">
      <Link
        href={pageUrl(currentPage - 1, categorySlug)}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        className={`text-muted px-3 py-2 text-sm transition-colors ${
          currentPage <= 1 ? 'pointer-events-none opacity-30' : 'hover:text-primary'
        }`}
      >
        ← Anterior
      </Link>

      <div className="flex items-center gap-1 px-2">
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="text-muted px-2 py-2 text-sm select-none">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={pageUrl(page, categorySlug)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex h-8 w-8 items-center justify-center text-sm transition-colors ${
                page === currentPage ? 'bg-primary text-surface' : 'text-ink hover:text-primary'
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      <Link
        href={pageUrl(currentPage + 1, categorySlug)}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        className={`text-muted px-3 py-2 text-sm transition-colors ${
          currentPage >= totalPages ? 'pointer-events-none opacity-30' : 'hover:text-primary'
        }`}
      >
        Siguiente →
      </Link>
    </nav>
  );
}
