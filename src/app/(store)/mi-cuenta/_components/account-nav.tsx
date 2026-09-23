'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '../login/actions';

const nav = [
  { href: '/mi-cuenta', label: 'Mi perfil' },
  { href: '/mi-cuenta/pedidos', label: 'Mis pedidos' },
] as const;

type Props = {
  displayName: string;
  email: string;
};

export function AccountNav({ displayName, email }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-full flex-shrink-0 md:w-52">
      <div className="mb-4 hidden md:block">
        <p className="text-ink truncate text-sm font-semibold">{displayName}</p>
        <p className="text-muted truncate text-xs">{email}</p>
      </div>
      <nav className="flex gap-2 md:flex-col">
        {nav.map(({ href, label }) => {
          const active = href === '/mi-cuenta' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:text-ink hover:bg-zinc-100'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="mt-4">
        <button type="submit" className="text-muted hover:text-ink text-xs underline">
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
