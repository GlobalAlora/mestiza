import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          fontSize: 14,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#8a6e5c',
          marginBottom: 24,
        }}
      >
        {siteConfig.brand.origin}
      </p>
      <h1
        style={{
          fontSize: 72,
          fontWeight: 400,
          color: '#3a1810',
          margin: 0,
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        {siteConfig.name}
      </h1>
      <p
        style={{
          fontSize: 22,
          color: '#6b4c3b',
          marginTop: 24,
          textAlign: 'center',
          maxWidth: 560,
        }}
      >
        {siteConfig.tagline}
      </p>
      <div
        style={{
          marginTop: 48,
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c4a882',
        }}
      >
        {siteConfig.legal.alcoholWarning}
      </div>
    </div>,
    size,
  );
}
