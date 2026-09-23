'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/store';
import { formatPrice, getStorageUrl } from '@/lib/utils';

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

type Props = { content: Record<string, string> };

export default function CartContent({ content }: Props) {
  const { items, removeItem, updateQuantity, clear, total } = useCartStore();
  const t = (key: string, fb: string) => content[key]?.trim() || fb;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <span className="text-primary/20 font-serif text-8xl select-none">SM</span>
        <h1 className="font-serif text-2xl">{t('carrito.empty_title', 'Tu carrito está vacío')}</h1>
        <p className="text-muted text-sm">
          {t('carrito.empty_body', 'Explorá nuestra selección de vinos y encontrá el tuyo.')}
        </p>
        <Link
          href="/tienda"
          className="bg-primary text-surface mt-2 px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
        >
          {t('carrito.empty_cta', 'Ir a la tienda')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 font-serif text-3xl">{t('carrito.title', 'Tu carrito')}</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y" aria-label="Productos en el carrito">
            {items.map((item) => {
              const imageUrl = item.imagePath ? getStorageUrl('products', item.imagePath) : null;
              return (
                <li key={item.variantId} className="flex gap-6 py-6">
                  {/* Imagen */}
                  <div className="bg-surface border-border relative h-28 w-20 flex-shrink-0 overflow-hidden border">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-primary/20 font-serif text-xl select-none">SM</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div>
                      <Link
                        href={`/producto/${item.slug}`}
                        className="text-ink hover:text-primary text-sm font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-muted mt-0.5 text-xs">{item.variantName}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Cantidad */}
                      <div className="border-border flex items-center border">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label={`Reducir cantidad de ${item.name}`}
                          className="text-muted hover:text-ink flex h-8 w-8 items-center justify-center transition-colors"
                        >
                          <MinusIcon />
                        </button>
                        <span className="text-ink w-10 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          className="text-muted hover:text-ink flex h-8 w-8 items-center justify-center transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <p className="text-primary font-serif text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-muted hover:text-ink self-start text-xs underline underline-offset-2 transition-colors"
                    >
                      {t('carrito.remove_item', 'Eliminar')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            onClick={clear}
            className="text-muted hover:text-ink mt-4 text-xs underline underline-offset-2 transition-colors"
          >
            {t('carrito.clear_cart', 'Vaciar carrito')}
          </button>
        </div>

        {/* Resumen */}
        <aside className="lg:col-span-1">
          <div className="border-border sticky top-24 border p-6">
            <h2 className="mb-6 font-serif text-xl">{t('carrito.summary_title', 'Resumen')}</h2>

            <div className="mb-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{t('carrito.subtotal_label', 'Subtotal')}</span>
                <span className="text-ink">{formatPrice(total())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('carrito.shipping_label', 'Envío')}</span>
                <span className="text-muted">{t('carrito.shipping_tbd', 'A calcular')}</span>
              </div>
            </div>

            <div className="border-border mb-6 flex justify-between border-t pt-4">
              <span className="font-medium">{t('carrito.total_label', 'Total')}</span>
              <span className="text-primary font-serif text-xl">{formatPrice(total())}</span>
            </div>

            <Link
              href="/checkout"
              className="bg-primary text-surface block w-full py-4 text-center text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
            >
              {t('carrito.checkout_cta', 'Continuar al pago')}
            </Link>

            <Link
              href="/tienda"
              className="text-muted hover:text-ink mt-4 block text-center text-xs underline underline-offset-2 transition-colors"
            >
              {t('carrito.continue_shopping', 'Seguir comprando')}
            </Link>

            <p className="text-muted mt-6 text-xs leading-relaxed">
              {t('carrito.terms_note', 'Al confirmar tu compra aceptás nuestros')}{' '}
              <Link href="/legal/terminos" className="underline underline-offset-2">
                {t('carrito.terms_link_text', 'Términos y condiciones')}
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
