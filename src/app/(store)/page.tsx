import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { siteConfig } from '@/config/site';
import { buildMetadata, websiteJsonLd, organizationJsonLd } from '@/lib/seo';
import { getFeaturedProducts } from '@/features/catalog/queries/get-products';
import { ProductCard } from '@/features/catalog/components/product-card';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: '/',
});

export default async function HomePage() {
  const products = await getFeaturedProducts(3);

  return (
    <>
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />

      {/* Hero */}
      <section
        className="flex min-h-[90svh] flex-col items-center justify-center px-4 text-center"
        aria-labelledby="hero-heading"
      >
        <p className="text-muted mb-5 text-xs font-semibold tracking-[0.3em] uppercase">
          {siteConfig.brand.origin}
        </p>
        <h1
          id="hero-heading"
          className="text-primary font-serif text-5xl leading-tight md:text-7xl"
        >
          {siteConfig.name}
        </h1>
        <p className="text-muted mt-5 max-w-md text-base md:text-lg">{siteConfig.tagline}</p>
        <Link
          href="/tienda"
          className="bg-primary text-surface mt-10 inline-block px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
        >
          Explorar vinos
        </Link>
      </section>

      {/* Productos destacados */}
      {products.length > 0 && (
        <section className="border-border border-t px-4 py-20" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
                Nuestros vinos
              </p>
              <h2 id="featured-heading" className="text-primary font-serif text-3xl md:text-4xl">
                Colección
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/tienda"
                className="text-primary text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Ver toda la tienda
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* La obra */}
      <section
        className="border-border bg-primary/5 border-t px-4 py-20 text-center"
        aria-labelledby="obra-heading"
      >
        <div className="mx-auto max-w-prose">
          <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
            La obra
          </p>
          <h2 id="obra-heading" className="text-primary font-serif text-3xl md:text-4xl">
            Como el vino, Soy Mestiza
          </h2>
          <p className="text-muted mt-5 text-base leading-relaxed">
            Ganadora del{' '}
            <strong className="text-ink font-semibold">{siteConfig.brand.award}</strong>. Flamenco,
            música árabe, folclore y tango fundidos en una propuesta única que da vida a esta
            colección de vinos de altura de Calingasta, San Juan.
          </p>
          <Link
            href="/historia"
            className="text-primary mt-8 inline-block text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Conocé la historia →
          </Link>
        </div>
      </section>
    </>
  );
}
