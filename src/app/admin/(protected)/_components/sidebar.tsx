'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '../../login/actions';

const nav = [
  {
    href: '/admin' as const,
    label: 'Dashboard',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/productos' as const,
    label: 'Productos',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    href: '/admin/categorias' as const,
    label: 'Categorías',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    href: '/admin/pedidos' as const,
    label: 'Pedidos',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    href: '/admin/envios' as const,
    label: 'Envíos',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    href: '/admin/clientes' as const,
    label: 'Clientes',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/usuarios' as const,
    label: 'Usuarios',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <line x1="15" y1="11" x2="22" y2="11" />
        <line x1="19" y1="8" x2="19" y2="14" />
      </svg>
    ),
  },
  {
    href: '/admin/contenido' as const,
    label: 'Contenido',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
];

type SidebarContentProps = {
  pathname: string;
  displayName: string;
  userEmail: string;
  onNavClick: () => void;
};

function SidebarContent({ pathname, displayName, userEmail, onNavClick }: SidebarContentProps) {
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <span className="font-serif text-xl text-white select-none">SM</span>
        <span className="text-xs tracking-widest text-white/60 uppercase">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4" aria-label="Navegación admin">
        {nav.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavClick}
            className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
              isActive(href)
                ? 'bg-white/15 font-medium text-white'
                : 'text-white/60 hover:bg-white/8 hover:text-white'
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-xs font-medium text-white/80">{displayName}</p>
        <p className="mb-3 truncate text-xs text-white/40">{userEmail}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-xs text-white/60 underline underline-offset-2 transition-colors hover:text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ displayName, userEmail }: { displayName: string; userEmail: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-zinc-900 md:flex">
        <SidebarContent
          pathname={pathname}
          displayName={displayName}
          userEmail={userEmail}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* Mobile toggle */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between bg-zinc-900 px-4 py-3 md:hidden">
        <span className="font-serif text-lg text-white">SM Admin</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/60 hover:text-white"
          aria-label="Menú"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
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
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-56 bg-zinc-900">
            <SidebarContent
              pathname={pathname}
              displayName={displayName}
              userEmail={userEmail}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
