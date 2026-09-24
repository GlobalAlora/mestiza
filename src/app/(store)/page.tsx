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
  const quote2 = c(content, 'home.quote2_text', '');

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
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}

        <div className="relative z-10">
          <p
            className={`mb-4 font-serif text-sm italic ${
              hasHeroVideo ? 'text-white/55' : 'text-muted'
            }`}
          >
            {c(content, 'general.origin', siteConfig.brand.origin)}
          </p>

          {/* Typographic hero — "Soy" whispers, "Mestiza" fills the frame */}
          <h1 id="hero-heading" className="font-serif leading-none">
            <span
              className={`block text-[1.6rem] font-light tracking-[0.05em] md:text-[2.5rem] ${
                hasHeroVideo ? 'text-white/60' : 'text-primary/55'
              }`}
            >
              Soy
            </span>
            <span
              className={`block text-[5.5rem] tracking-[-0.03em] md:text-[9rem] lg:text-[11.5rem] ${
                hasHeroVideo ? 'text-white' : 'text-primary'
              }`}
            >
              Mestiza
            </span>
          </h1>

          <p
            className={`mt-7 max-w-xs text-base leading-relaxed font-light tracking-wide md:max-w-sm md:text-lg ${
              hasHeroVideo ? 'text-white/65' : 'text-muted'
            }`}
          >
            {c(content, 'home.hero_tagline', siteConfig.tagline)}
          </p>
          <Link
            href="/tienda"
            className={`mt-10 inline-block px-8 py-3 text-xs font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-85 ${
              hasHeroVideo
                ? 'border border-white/70 text-white hover:bg-white/10'
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
            {/* Editorial header — title left, CTA right */}
            <div className="border-border mb-12 flex items-end justify-between border-b pb-6">
              <div>
                <p className="text-muted font-serif text-sm italic">
                  {c(content, 'home.featured_label', 'Nuestros vinos')}
                </p>
                <h2
                  id="featured-heading"
                  className="text-primary mt-1 font-serif text-3xl md:text-4xl"
                >
                  {c(content, 'home.featured_title', 'Colección')}
                </h2>
              </div>
              <Link
                href="/tienda"
                className="text-primary mb-1 hidden text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70 md:block"
              >
                {c(content, 'home.featured_all_cta', 'Ver toda la tienda')}
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.35rem)]"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Mobile-only CTA */}
            <div className="mt-12 text-center md:hidden">
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

      {/* Pilares */}
      <section className="border-border border-t px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            <div>
              <p className="text-primary font-serif text-6xl leading-none tracking-[-0.02em] md:text-7xl">
                {c(content, 'home.pilar1_stat', '2.000')}
              </p>
              <p className="text-muted mt-3 font-serif text-sm italic">
                {c(content, 'home.pilar1_title', 'metros sobre el mar')}
              </p>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                {c(
                  content,
                  'home.pilar1_body',
                  'Viñedos en la Precordillera de Calingasta, donde la altitud extrema concentra aromas, estructura y carácter único.',
                )}
              </p>
            </div>

            <div className="border-border md:border-x md:px-8">
              <p className="text-primary font-serif text-6xl leading-none tracking-[-0.02em] md:text-7xl">
                {c(content, 'home.pilar2_stat', '4')}
              </p>
              <p className="text-muted mt-3 font-serif text-sm italic">
                {c(content, 'home.pilar2_title', 'raíces musicales')}
              </p>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                {c(
                  content,
                  'home.pilar2_body',
                  'Flamenco, árabe, folclore y tango fundidos en una obra que da nombre e identidad a cada etiqueta.',
                )}
              </p>
            </div>

            <div>
              <p className="text-primary font-serif text-6xl leading-none tracking-[-0.02em] md:text-7xl">
                {c(content, 'home.pilar3_stat', '1')}
              </p>
              <p className="text-muted mt-3 font-serif text-sm italic">
                {c(content, 'home.pilar3_title', 'región de autor')}
              </p>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                {c(
                  content,
                  'home.pilar3_body',
                  'Calingasta es uno de los pocos valles de altura de Argentina con condiciones únicas para vinos de autor.',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La obra */}
      <section className="border-border border-t" aria-labelledby="obra-heading">
        <div
          className={`grid grid-cols-1 lg:min-h-[560px] ${hasObraImage ? 'lg:grid-cols-2' : ''}`}
        >
          {hasObraImage && (
            <div className="relative min-h-[300px] overflow-hidden">
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
            className={`bg-primary/5 flex flex-col justify-center px-8 py-16 lg:px-16 ${
              hasObraImage ? '' : 'text-center'
            }`}
          >
            <div className={`${hasObraImage ? 'max-w-lg' : 'mx-auto max-w-prose text-center'}`}>
              <p className="text-muted mb-4 font-serif text-sm italic">
                {c(content, 'home.obra_label', 'La obra')}
              </p>
              <h2
                id="obra-heading"
                className="text-primary font-serif text-4xl leading-tight md:text-5xl"
              >
                {c(content, 'home.obra_title', 'Como el vino, Soy Mestiza')}
              </h2>
              <p className="text-muted mt-6 text-base leading-[1.85]">
                {c(content, 'home.obra_body', obraBodyDefault)}
              </p>
              <Link
                href="/historia"
                className="text-primary mt-10 inline-block text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {c(content, 'home.obra_cta', 'Conocé la historia')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reconocimientos */}
      <section className="bg-primary px-4 py-24 text-center" aria-labelledby="prensa-heading">
        <div className="mx-auto max-w-2xl">
          <p id="prensa-heading" className="mb-14 font-serif text-sm text-white/50 italic">
            {c(content, 'home.prensa_label', 'Reconocimientos')}
          </p>

          <span
            className="-mb-8 block font-serif text-9xl leading-none text-white/[0.07] select-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote>
            <p className="font-serif text-2xl leading-relaxed text-white/90 italic md:text-3xl">
              &ldquo;
              {c(
                content,
                'home.quote1_text',
                'Una propuesta que une el arte y la tierra. Vinos únicos de altura con alma argentina.',
              )}
              &rdquo;
            </p>
            <footer className="mt-6 font-serif text-sm text-white/50 italic">
              — {c(content, 'home.quote1_source', 'Revista de Vinos Argentina')}
            </footer>
          </blockquote>

          <div className="mx-auto my-12 w-8 border-t border-white/20" />

          <div className="inline-block border border-white/25 px-8 py-3">
            <p className="font-serif text-sm text-white/80 italic">
              {c(content, 'home.award_badge', award)}
            </p>
          </div>

          {quote2 && (
            <>
              <div className="mx-auto my-12 w-8 border-t border-white/20" />
              <blockquote>
                <p className="font-serif text-xl leading-relaxed text-white/90 italic md:text-2xl">
                  &ldquo;{quote2}&rdquo;
                </p>
                <footer className="mt-6 font-serif text-sm text-white/50 italic">
                  — {c(content, 'home.quote2_source', '')}
                </footer>
              </blockquote>
            </>
          )}
        </div>
      </section>
    </>
  );
}
