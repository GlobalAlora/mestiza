import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { getCategories } from '@/features/catalog/queries/get-categories';
import {
  getPublishedProductsPage,
  getCatalogCounts,
} from '@/features/catalog/queries/get-products';
import { CatalogShell } from '@/features/catalog/components/catalog-shell';
import { getContentMap, c } from '@/lib/content';

export const revalidate = 3600;

const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  title: `Tienda | ${siteConfig.name}`,
  description: 'Explorá nuestra colección de vinos de altura del Valle de Calingasta, San Juan.',
  path: '/tienda',
});

type Props = {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
};

export default async function TiendaPage({ searchParams }: Props) {
  const { categoria, pagina } = await searchParams;
  const page = Math.max(1, parseInt(pagina ?? '1', 10) || 1);

  const [categories, content] = await Promise.all([getCategories(), getContentMap()]);

  const activeCategory = categories.find((cat) => cat.slug === categoria) ?? null;

  const [{ products, total }, counts] = await Promise.all([
    getPublishedProductsPage({
      categoryId: activeCategory?.id,
      page,
      pageSize: PAGE_SIZE,
    }),
    getCatalogCounts(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-12">
        <p className="text-muted mb-2 font-serif text-sm italic">{siteConfig.name}</p>
        <h1 className="text-primary font-serif text-4xl md:text-5xl">
          {c(content, 'tienda.title', 'Tienda')}
        </h1>
      </header>

      <Suspense>
        <CatalogShell
          products={products}
          categories={categories}
          counts={counts}
          currentPage={page}
          totalPages={totalPages}
          activeCategory={activeCategory}
        />
      </Suspense>
    </div>
  );
}
