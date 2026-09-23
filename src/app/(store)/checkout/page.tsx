import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Checkout | Soy Mestiza',
  description: 'Checkout de Soy Mestiza.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">Checkout</h1>
      <p className="text-muted text-sm">Próximamente — estamos terminando de configurar el pago.</p>
      <Link
        href="/carrito"
        className="bg-primary text-surface px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
      >
        Volver al carrito
      </Link>
    </div>
  );
}
