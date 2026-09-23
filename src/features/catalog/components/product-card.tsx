import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getStorageUrl } from '@/lib/utils';
import { getMinPrice, isInStock } from '../utils/product-helpers';
import type { ProductCard as ProductCardType } from '../types';

type Props = {
  product: ProductCardType;
};

const PLACEHOLDER_WINES = ['20579556', '26834216', '9145965', '14799841', '11675004'];
function placeholderWineUrl(seed: string) {
  const h = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const id = PLACEHOLDER_WINES[h % PLACEHOLDER_WINES.length]!;
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=600`;
}

export function ProductCard({ product }: Props) {
  const firstImage = product.product_images[0];
  const minPrice = getMinPrice(product.product_variants);
  const inStock = isInStock(product.product_variants);
  const multipleVariants = product.product_variants.length > 1;
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={placeholderWineUrl(product.id)}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-black/0 pb-6 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
            <span className="border border-white/80 bg-white/90 px-5 py-2 text-xs font-semibold tracking-widest text-zinc-900 uppercase backdrop-blur-sm">
              Ver producto
            </span>
          </div>

          {!inStock && (
            <div className="bg-ink/30 absolute inset-0 flex items-center justify-center">
              <span className="bg-surface/90 text-ink px-3 py-1 text-xs font-semibold tracking-widest uppercase">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <Link href={`/producto/${product.slug}`} className="group/link">
            <h2 className="text-ink group-hover/link:text-primary font-serif text-lg leading-snug transition-colors">
              {product.name}
            </h2>
          </Link>
          {minPrice > 0 && (
            <p className="text-muted text-sm">
              {multipleVariants ? 'Desde ' : ''}
              <span className="text-ink font-medium">{formatPrice(minPrice)}</span>
            </p>
          )}
        </div>

        {inStock && (
          <Link
            href={`/producto/${product.slug}`}
            className="text-primary border-primary hover:bg-primary hover:text-surface mt-0.5 shrink-0 border px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors"
            aria-label={`Comprar ${product.name}`}
          >
            Comprar
          </Link>
        )}
      </div>
    </article>
  );
}
