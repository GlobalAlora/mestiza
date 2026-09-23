import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getStorageUrl } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { esAR } from '@/i18n/es-AR';
import {
  getProductBySlug,
  getAllPublishedSlugs,
} from '@/features/catalog/queries/get-product-by-slug';
import { getMinPrice, isInStock } from '@/features/catalog/queries/get-products';
import { VariantSelector } from '@/features/catalog/components/variant-selector';
import { ProductGallery } from '@/features/catalog/components/product-gallery';
import { ProductCard } from '@/features/catalog/components/product-card';
import { getRelatedProducts } from '@/features/catalog/queries/get-products';
import { getContentMap, c } from '@/lib/content';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const firstImage = product.product_images[0];
  const imageUrl = firstImage ? getStorageUrl('products', firstImage.storage_path) : undefined;

  return buildMetadata({
    title: `${product.name} | ${siteConfig.name}`,
    description:
      product.description ??
      `${product.name} — vino de altura de Calingasta, San Juan. ${siteConfig.name}.`,
    path: `/producto/${slug}`,
    image: imageUrl,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, content] = await Promise.all([
    getRelatedProducts(product.category_id, product.id, 3),
    getContentMap(),
  ]);

  const firstImage = product.product_images[0];
  const imageUrl = firstImage ? getStorageUrl('products', firstImage.storage_path) : null;
  const minPrice = getMinPrice(product.product_variants);
  const inStock = isInStock(product.product_variants);
  const attrs = (product.attributes ?? {}) as Record<string, string | number | null | undefined>;
  const t = esAR.catalog.attributes;

  const ldProduct = productJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    imageUrl,
    minPriceCents: minPrice,
    maxPriceCents: Math.max(...product.product_variants.map((v) => v.price_cents), minPrice),
    inStock,
  });

  const ldBreadcrumb = breadcrumbJsonLd([
    { name: 'Inicio', url: siteConfig.url },
    { name: 'Tienda', url: `${siteConfig.url}/tienda` },
    ...(product.categories
      ? [
          {
            name: product.categories.name,
            url: `${siteConfig.url}/tienda/${product.categories.slug}`,
          },
        ]
      : []),
    { name: product.name, url: `${siteConfig.url}/producto/${product.slug}` },
  ]);

  return (
    <>
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldProduct) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-muted mb-8 flex items-center gap-2 text-xs" aria-label="Ubicación">
          <Link href="/tienda" className="hover:text-primary transition-colors">
            {c(content, 'producto.breadcrumb_tienda', 'Tienda')}
          </Link>
          {product.categories && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/tienda/${product.categories.slug}`}
                className="hover:text-primary transition-colors"
              >
                {product.categories.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Layout principal */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Galería */}
          <ProductGallery images={product.product_images} productName={product.name} />

          {/* Detalle */}
          <div className="flex flex-col gap-8">
            {/* Nombre y origen */}
            <div>
              {product.categories && (
                <p className="text-muted mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
                  {product.categories.name}
                </p>
              )}
              <h1 className="text-primary font-serif text-4xl leading-tight">{product.name}</h1>
              {product.description && (
                <p className="text-muted mt-4 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Selector de variantes + añadir al carrito */}
            <VariantSelector
              variants={product.product_variants}
              productName={product.name}
              productId={product.id}
              slug={product.slug}
              imagePath={firstImage?.storage_path ?? null}
            />

            {/* Atributos del vino */}
            {Object.keys(attrs).length > 0 && (
              <dl className="border-border grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-8 text-sm">
                {attrs['varietal'] && (
                  <div>
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.varietal}
                    </dt>
                    <dd className="text-ink mt-0.5">{String(attrs['varietal'])}</dd>
                  </div>
                )}
                {attrs['vintage_year'] && (
                  <div>
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.vintage}
                    </dt>
                    <dd className="text-ink mt-0.5">{String(attrs['vintage_year'])}</dd>
                  </div>
                )}
                {attrs['region'] && (
                  <div>
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.region}
                    </dt>
                    <dd className="text-ink mt-0.5">{String(attrs['region'])}</dd>
                  </div>
                )}
                {attrs['altitude_masl'] && (
                  <div>
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.altitude}
                    </dt>
                    <dd className="text-ink mt-0.5">
                      {String(attrs['altitude_masl'])}{' '}
                      {c(content, 'producto.unit_altitude', 'msnm')}
                    </dd>
                  </div>
                )}
                {attrs['alcohol_pct'] && (
                  <div>
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.alcohol}
                    </dt>
                    <dd className="text-ink mt-0.5">
                      {String(attrs['alcohol_pct'])}
                      {c(content, 'producto.unit_alcohol', '% alc.')}
                    </dd>
                  </div>
                )}
                {attrs['tasting_notes'] && (
                  <div className="col-span-2">
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.tastingNotes}
                    </dt>
                    <dd className="text-ink mt-0.5">{String(attrs['tasting_notes'])}</dd>
                  </div>
                )}
                {attrs['pairing'] && (
                  <div className="col-span-2">
                    <dt className="text-muted text-xs font-semibold tracking-[0.15em] uppercase">
                      {t.pairing}
                    </dt>
                    <dd className="text-ink mt-0.5">{String(attrs['pairing'])}</dd>
                  </div>
                )}
              </dl>
            )}

            {/* Aviso legal */}
            <p className="text-muted text-xs">{siteConfig.legal.alcoholWarning}</p>
          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <div className="border-border mt-16 border-t pt-16">
            <h2 className="text-primary mb-8 text-center font-serif text-2xl">
              {c(content, 'producto.related_title', 'También te puede gustar')}
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
