import type { Metadata } from 'next';
import { Suspense } from 'react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { getCategories } from '@/features/catalog/queries/get-categories';
import { getPublishedProducts } from '@/features/catalog/queries/get-products';
import { CatalogShell } from '@/features/catalog/components/catalog-shell';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: `Tienda | ${siteConfig.name}`,
  description: 'Explorá nuestra colección de vinos de altura del Valle de Calingasta, San Juan.',
  path: '/tienda',
});

export default async function TiendaPage() {
  const [products, categories] = await Promise.all([getPublishedProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-12">
        <p className="text-muted mb-2 text-xs font-semibold tracking-[0.3em] uppercase">
          {siteConfig.name}
        </p>
        <h1 className="text-primary font-serif text-4xl md:text-5xl">Tienda</h1>
      </header>

      <Suspense>
        <CatalogShell products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
