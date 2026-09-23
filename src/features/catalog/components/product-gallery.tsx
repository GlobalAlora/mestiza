'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { getStorageUrl } from '@/lib/utils';

type ProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  position?: number;
};

type Props = {
  images: ProductImage[];
  productName: string;
};

const PLACEHOLDER_WINES = ['20579556', '26834216', '9145965'];
const placeholderUrl = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=600`;

export function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);

  const openLightbox = (startIndex: number) => {
    Fancybox.show(
      images.map((img) => ({
        src: getStorageUrl('products', img.storage_path),
        thumb: getStorageUrl('products', img.storage_path),
        caption: img.alt_text ?? productName,
      })),
      { startIndex },
    );
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="bg-surface relative aspect-[3/4] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={placeholderUrl(PLACEHOLDER_WINES[active % PLACEHOLDER_WINES.length]!)}
            alt={productName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PLACEHOLDER_WINES.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`border-border relative h-16 w-14 flex-shrink-0 overflow-hidden border transition-colors ${
                i === active ? 'border-primary' : 'hover:border-primary/50'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={placeholderUrl(id)}
                alt={`${productName} ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const idx = active < images.length ? active : 0;
  const current = images[idx]!;

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal — click abre lightbox */}
      <button
        type="button"
        onClick={() => openLightbox(idx)}
        className="bg-surface relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden"
        aria-label="Ampliar imagen"
      >
        <Image
          key={current.id}
          src={getStorageUrl('products', current.storage_path)}
          alt={current.alt_text ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-200"
          priority={idx === 0}
        />
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className={`border-border relative h-16 w-14 flex-shrink-0 overflow-hidden border transition-colors ${
                i === active ? 'border-primary' : 'hover:border-primary/50'
              }`}
            >
              <Image
                src={getStorageUrl('products', img.storage_path)}
                alt={img.alt_text ?? `${productName} ${i + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
