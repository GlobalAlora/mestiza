import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';
import { getProductBySlug } from '@/features/catalog/queries/get-product-by-slug';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ slug: string }> };

export default async function ProductOGImage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const name = product?.name ?? siteConfig.name;
  const attrs = (product?.attributes ?? {}) as Record<string, unknown>;
  const varietal = attrs['varietal'] ? String(attrs['varietal']) : null;
  const region = attrs['region'] ? String(attrs['region']) : siteConfig.brand.origin;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f4ede4',
        fontFamily: 'Georgia, serif',
        padding: '60px',
      }}
    >
      <p
        style={{
          fontSize: 12,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#8a6e5c',
          marginBottom: 20,
        }}
      >
        {siteConfig.name}
      </p>
      <h1
        style={{
          fontSize: 64,
          fontWeight: 400,
          color: '#3a1810',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        {name}
      </h1>
      {varietal && (
        <p
          style={{
            fontSize: 18,
            color: '#6b4c3b',
            marginTop: 16,
            letterSpacing: '0.1em',
          }}
        >
          {varietal}
        </p>
      )}
      <p
        style={{
          fontSize: 14,
          color: '#8a6e5c',
          marginTop: 8,
        }}
      >
        {region}
      </p>
      <div
        style={{
          marginTop: 40,
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c4a882',
        }}
      >
        {siteConfig.legal.drinkResponsibly}
      </div>
    </div>,
    size,
  );
}
