'use client';

import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { getStorageUrl } from '@/lib/utils';
import { uploadProductImage, deleteProductImage } from '../actions';

type ProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  position: number;
};

export function ImageManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set('image', file);
    try {
      await uploadProductImage(productId, fd);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = (imageId: string, storagePath: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    startTransition(async () => {
      await deleteProductImage(imageId, storagePath, productId);
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-ink mb-5 font-semibold">Imágenes</h2>

      <div className="mb-4 flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.id} className="group relative">
            <div className="border-border bg-surface relative h-24 w-20 overflow-hidden border">
              <Image
                src={getStorageUrl('products', img.storage_path)}
                alt={img.alt_text ?? ''}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleDelete(img.id, img.storage_path)}
              className="bg-error absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ))}

        <label className="border-border text-muted hover:border-primary hover:text-primary flex h-24 w-20 cursor-pointer flex-col items-center justify-center border border-dashed transition-colors">
          {uploading ? (
            <span className="text-xs">Subiendo…</span>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="mt-1 text-xs">Imagen</span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <p className="text-muted text-xs">Máx. 5 MB por imagen. Formatos: JPG, PNG, WebP, AVIF.</p>
    </div>
  );
}
