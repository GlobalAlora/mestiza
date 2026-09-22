import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getCategories } from '@/features/catalog/queries/get-categories';
import { getAllPublishedSlugs } from '@/features/catalog/queries/get-product-by-slug';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [categorySlugs, productSlugs] = await Promise.all([
    getCategories().then((cats) => cats.map((c) => c.slug)),
    getAllPublishedSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/tienda`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/historia`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contacto`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${base}/tienda/${slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${base}/producto/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
