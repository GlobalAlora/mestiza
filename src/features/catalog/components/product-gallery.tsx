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
      <div className="bg-surface relative flex aspect-[3/4] items-center justify-center overflow-hidden">
        <span className="text-primary/10 font-serif text-8xl select-none">SM</span>
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
