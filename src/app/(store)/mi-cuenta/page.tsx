import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Mi cuenta | Soy Mestiza',
  description: 'Accedé a tu cuenta de Soy Mestiza.',
  path: '/mi-cuenta',
  noIndex: true,
});

export default function MiCuentaPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">Mi cuenta</h1>
      <p className="text-muted text-sm">Próximamente — iniciá sesión para ver tus pedidos.</p>
      <Link
        href="/tienda"
        className="bg-primary text-surface px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
      >
        Ir a la tienda
      </Link>
    </div>
  );
}
