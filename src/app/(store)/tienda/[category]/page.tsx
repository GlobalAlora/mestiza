import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { getCategories, getCategoryBySlug } from '@/features/catalog/queries/get-categories';
import { getPublishedProducts } from '@/features/catalog/queries/get-products';
import { ProductCard } from '@/features/catalog/components/product-card';

export const revalidate = 3600;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.name} | ${siteConfig.name}`,
    description:
      category.description ??
      `Vinos de ${category.name} de Calingasta, San Juan. ${siteConfig.description}`,
    path: `/tienda/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);

  if (!category) notFound();

  const products = await getPublishedProducts(category.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Encabezado */}
      <header className="mb-12">
        <p className="text-muted mb-2 text-xs font-semibold tracking-[0.3em] uppercase">
          {siteConfig.name}
        </p>
        <h1 className="text-primary font-serif text-4xl md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="text-muted mt-4 max-w-prose">{category.description}</p>
        )}
      </header>

      {/* Filtros por categoría */}
      {categories.length > 1 && (
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Categorías">
          <Link
            href="/tienda"
            className="border-border text-ink hover:border-primary hover:text-primary border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors"
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/tienda/${cat.slug}`}
              className={
                cat.slug === slug
                  ? 'border-primary bg-primary text-surface border px-4 py-1.5 text-xs font-medium tracking-wide uppercase'
                  : 'border-border text-ink hover:border-primary hover:text-primary border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors'
              }
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-muted py-20 text-center">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
