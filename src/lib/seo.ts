import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

// ─────────────────────────────────────────
// Metadata helpers
// ─────────────────────────────────────────

export function buildTitle(page: string): string {
  return `${page} | ${siteConfig.name}`;
}

type MetaParams = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: MetaParams): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/opengraph-image.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─────────────────────────────────────────
// JSON-LD structured data
// ─────────────────────────────────────────

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/tienda?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.contact.email,
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [siteConfig.social.instagram],
  };
}

type ProductForSchema = {
  name: string;
  description: string | null;
  slug: string;
  imageUrl?: string | null;
  minPriceCents: number;
  maxPriceCents: number;
  inStock: boolean;
};

export function productJsonLd(product: ProductForSchema) {
  const url = `${siteConfig.url}/producto/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    url,
    brand: { '@type': 'Brand', name: siteConfig.name },
    ...(product.imageUrl ? { image: [product.imageUrl] } : {}),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ARS',
      lowPrice: (product.minPriceCents / 100).toFixed(0),
      highPrice: (product.maxPriceCents / 100).toFixed(0),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
