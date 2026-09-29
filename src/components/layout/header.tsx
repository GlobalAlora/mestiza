'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';

type NavItem = { href: string; label: string };
import { useCartStore } from '@/features/cart/store';
import { CartCount } from '@/features/cart/cart-count';
import { AccountIcon } from './account-icon';

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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

interface HeaderProps {
  navItems?: readonly NavItem[];
}

export function Header({ navItems = mainNav }: HeaderProps) {
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mid = Math.ceil(navItems.length / 2);
  const leftNav = navItems.slice(0, mid);
  const rightNav = navItems.slice(mid);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="border-border bg-surface/90 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="focus:bg-primary focus:text-surface sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-1 focus:text-xs"
        >
          Saltar al contenido
        </a>

        {/* Left: desktop nav (first 2 items) | mobile: hamburger */}
        <div>
          <nav aria-label="Navegación principal" className="hidden md:flex">
            <ul className="flex items-center gap-8" role="list">
              {leftNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href as Route}
                    className="nav-link text-ink hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="text-ink hover:text-primary transition-colors md:hidden"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* Center: logo */}
        <Link
          href="/"
          className="text-primary font-serif text-xl font-medium transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} — inicio`}
          onClick={closeMobile}
        >
          {siteConfig.name}
        </Link>

        {/* Right: desktop nav (last 2 items) + icons */}
        <div className="flex items-center justify-end gap-6">
          <nav aria-label="Navegación secundaria" className="hidden md:flex">
            <ul className="flex items-center gap-8" role="list">
              {rightNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href as Route}
                    className="nav-link text-ink hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <AccountIcon />
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav aria-label="Navegación móvil" className="border-border bg-surface border-t md:hidden">
          <ul className="flex flex-col py-2" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className="text-ink hover:text-primary block px-4 py-3 text-sm transition-colors"
                  onClick={closeMobile}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
