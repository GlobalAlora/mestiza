'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from './store';
import { formatPrice, getStorageUrl, cn } from '@/lib/utils';

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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

export function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'bg-ink/40 fixed inset-0 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={cn(
          'bg-surface fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header del drawer */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-serif text-lg">Tu carrito</h2>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="text-muted hover:text-ink transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-primary/20 font-serif text-6xl select-none">SM</span>
            <p className="text-muted text-sm">Tu carrito está vacío.</p>
            <button
              onClick={closeDrawer}
              className="text-primary text-sm font-medium underline underline-offset-4"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto" aria-label="Productos en el carrito">
            {items.map((item) => {
              const imageUrl = item.imagePath ? getStorageUrl('products', item.imagePath) : null;
              return (
                <li key={item.variantId} className="flex gap-4 px-6 py-4">
                  {/* Imagen */}
                  <div className="bg-surface border-border relative h-20 w-14 flex-shrink-0 overflow-hidden border">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-primary/20 font-serif text-lg select-none">SM</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                      <p className="text-ink truncate text-sm font-medium">{item.name}</p>
                      <p className="text-muted text-xs">{item.variantName}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {/* Cantidad */}
                      <div className="border-border flex items-center border">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label={`Reducir cantidad de ${item.name}`}
                          className="text-muted hover:text-ink flex h-7 w-7 items-center justify-center transition-colors"
                        >
                          <MinusIcon />
                        </button>
                        <span className="text-ink w-8 text-center text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          className="text-muted hover:text-ink flex h-7 w-7 items-center justify-center transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <p className="text-primary font-serif text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-muted hover:text-ink self-start text-xs underline underline-offset-2 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer con total y CTA */}
        {items.length > 0 && (
          <div className="border-border border-t px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted text-sm">Subtotal</span>
              <span className="text-primary font-serif text-xl">{formatPrice(total())}</span>
            </div>
            <p className="text-muted mb-4 text-xs">Envío calculado en el checkout.</p>
            <Link
              href="/carrito"
              onClick={closeDrawer}
              className="bg-primary text-surface block w-full py-3.5 text-center text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
            >
              Ir al checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
