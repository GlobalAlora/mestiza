import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
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

      {/* Placeholder — replaced in Phase 3 with content_blocks */}
      <section
        className="border-border border-t px-4 py-20 text-center"
        aria-labelledby="obra-heading"
      >
        <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">La obra</p>
        <h2 id="obra-heading" className="text-primary font-serif text-3xl md:text-4xl">
          Como el vino, Soy Mestiza
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-prose">
          Ganadora del {siteConfig.brand.award}. Flamenco, música árabe, folclore y tango fundidos
          en una propuesta única que da vida a esta colección de vinos de altura.
        </p>
        <Link
          href="/historia"
          className="text-primary mt-6 inline-block text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Conocé la historia
        </Link>
      </section>
    </>
  );
}
