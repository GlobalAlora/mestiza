import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { siteConfig } from '@/config/site';
import { buildMetadata, websiteJsonLd, organizationJsonLd } from '@/lib/seo';
import { getFeaturedProducts } from '@/features/catalog/queries/get-products';
import { ProductCard } from '@/features/catalog/components/product-card';
import { getContentMap, c } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: '/',
});

const PLACEHOLDER_VIDEO =
  'https://videos.pexels.com/video-files/37296000/15798504_1920_1080_24fps.mp4';
const PLACEHOLDER_IMAGE =
  'https://images.pexels.com/photos/31025244/pexels-photo-31025244/free-photo-of-vast-vineyard-landscape-in-tunuyan-mendoza.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80';

export default async function HomePage() {
  const [products, content] = await Promise.all([getFeaturedProducts(3), getContentMap()]);

  const award = c(content, 'general.award', siteConfig.brand.award);
  const obraBodyDefault = `Ganadora del ${award}. Flamenco, música árabe, folclore y tango fundidos en una propuesta única que da vida a esta colección de vinos de altura de Calingasta, San Juan.`;

  const heroVideoUrl = c(content, 'home.hero_video_url', PLACEHOLDER_VIDEO);
  const obraImageUrl = c(content, 'home.obra_image_url', PLACEHOLDER_IMAGE);

  const hasHeroVideo = heroVideoUrl.startsWith('http');
  const hasObraImage = obraImageUrl.startsWith('http');

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
        className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-4 text-center"
        aria-labelledby="hero-heading"
      >
        {hasHeroVideo && (
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={heroVideoUrl}
              poster={PLACEHOLDER_IMAGE}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        )}

        <div className="relative z-10">
          <p
            className={`mb-5 text-xs font-semibold tracking-[0.3em] uppercase ${
              hasHeroVideo ? 'text-white/70' : 'text-muted'
            }`}
          >
            {c(content, 'general.origin', siteConfig.brand.origin)}
          </p>
          <h1
            id="hero-heading"
            className={`font-serif text-5xl leading-tight md:text-7xl ${
              hasHeroVideo ? 'text-white' : 'text-primary'
            }`}
          >
            {siteConfig.name}
          </h1>
          <p
            className={`mt-5 max-w-md text-base md:text-lg ${
              hasHeroVideo ? 'text-white/80' : 'text-muted'
            }`}
          >
            {c(content, 'home.hero_tagline', siteConfig.tagline)}
          </p>
          <Link
            href="/tienda"
            className={`mt-10 inline-block px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85 ${
              hasHeroVideo
                ? 'border border-white/80 text-white hover:bg-white/10'
                : 'bg-primary text-surface'
            }`}
          >
            {c(content, 'home.hero_cta', 'Explorar vinos')}
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      {products.length > 0 && (
        <section className="border-border border-t px-4 py-20" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
                {c(content, 'home.featured_label', 'Nuestros vinos')}
              </p>
              <h2 id="featured-heading" className="text-primary font-serif text-3xl md:text-4xl">
                {c(content, 'home.featured_title', 'Colección')}
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
                {c(content, 'home.featured_all_cta', 'Ver toda la tienda')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* La obra */}
      <section className="border-border border-t" aria-labelledby="obra-heading">
        <div
          className={`grid grid-cols-1 lg:min-h-[520px] ${hasObraImage ? 'lg:grid-cols-2' : ''}`}
        >
          {hasObraImage && (
            <div className="relative min-h-[280px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={obraImageUrl}
                alt="Viñedos de Calingasta, San Juan"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div
            className={`bg-primary/5 flex flex-col justify-center px-8 py-16 lg:px-14 ${
              hasObraImage ? '' : 'text-center'
            }`}
          >
            <div className={`${hasObraImage ? 'max-w-lg' : 'mx-auto max-w-prose text-center'}`}>
              <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
                {c(content, 'home.obra_label', 'La obra')}
              </p>
              <h2 id="obra-heading" className="text-primary font-serif text-3xl md:text-4xl">
                {c(content, 'home.obra_title', 'Como el vino, Soy Mestiza')}
              </h2>
              <p className="text-muted mt-5 text-base leading-relaxed">
                {c(content, 'home.obra_body', obraBodyDefault)}
              </p>
              <Link
                href="/historia"
                className="text-primary mt-8 inline-block text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {c(content, 'home.obra_cta', 'Conocé la historia →')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
