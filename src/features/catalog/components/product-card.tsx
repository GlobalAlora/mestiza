import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getStorageUrl } from '@/lib/utils';
import { getMinPrice, isInStock } from '../queries/get-products';
import type { ProductCard as ProductCardType } from '../queries/get-products';

type Props = {
  product: ProductCardType;
};

export function ProductCard({ product }: Props) {
  const firstImage = product.product_images[0];
  const minPrice = getMinPrice(product.product_variants);
  const inStock = isInStock(product.product_variants);
  const imageUrl = firstImage ? getStorageUrl('products', firstImage.storage_path) : null;

  return (
    <article className="group flex flex-col">
      <Link
        href={`/producto/${product.slug}`}
        className="block overflow-hidden"
        aria-label={`Ver ${product.name}`}
        tabIndex={-1}
      >
        <div className="bg-surface relative aspect-[3/4] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={firstImage?.alt_text ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-end justify-center pb-8">
              <span className="text-primary/20 font-serif text-5xl select-none">SM</span>
            </div>
          )}
          {!inStock && (
            <div className="bg-ink/30 absolute inset-0 flex items-center justify-center">
              <span className="bg-surface/90 text-ink px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <Link href={`/producto/${product.slug}`} className="group/link">
          <h2 className="text-ink group-hover/link:text-primary font-serif text-lg leading-snug transition-colors">
            {product.name}
          </h2>
        </Link>
        {minPrice > 0 && (
          <p className="text-muted text-sm">
            {product.product_variants.length > 1 ? 'Desde ' : ''}
            <span className="text-ink font-medium">{formatPrice(minPrice)}</span>
          </p>
        )}
      </div>
    </article>
  );
}
