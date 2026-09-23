import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Mis pedidos | Soy Mestiza',
  description: 'Seguí el estado de tus pedidos.',
  path: '/mi-cuenta/pedidos',
  noIndex: true,
});

export default function MisPedidosPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">Mis pedidos</h1>
      <p className="text-muted text-sm">Próximamente — podrás hacer seguimiento de tus compras.</p>
      <Link
        href="/tienda"
        className="bg-primary text-surface px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
      >
        Ir a la tienda
      </Link>
    </div>
  );
}
