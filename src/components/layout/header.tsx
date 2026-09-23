'use client';

import Link from 'next/link';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/features/cart/store';
import { CartCount } from '@/features/cart/cart-count';

function CartIcon() {
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function Header() {
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="border-border bg-surface/90 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-surface sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-1 focus:text-xs"
        >
          Saltar al contenido
        </a>

        <Link
          href="/"
          className="text-primary font-serif text-xl font-medium tracking-wide transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — inicio`}
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Navegación principal">
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink hover:text-primary text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openDrawer}
            aria-label="Abrir carrito de compras"
            className="text-ink hover:text-primary relative transition-colors"
          >
            <CartIcon />
            <CartCount />
          </button>
        </div>
      </div>
    </header>
  );
}
