import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Pago fallido — Soy Mestiza' };

type Props = {
  searchParams: Promise<{ access_token?: string }>;
};

export default async function FallidoPage({ searchParams }: Props) {
  const { access_token } = await searchParams;

  let orderNumber: string | number | null = null;
  if (access_token) {
    const db = createAdminClient();
    const { data } = await db
      .from('orders')
      .select('order_number')
      .eq('access_token', access_token)
      .single();
    orderNumber = data?.order_number ?? null;
  }

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="text-error mb-4 text-5xl">✕</div>
        <h1 className="text-ink mb-2 text-2xl font-semibold">El pago no se pudo procesar</h1>
        {orderNumber && (
          <p className="text-muted mb-4 text-sm">
            Pedido <strong className="text-ink">#{orderNumber}</strong> — el pago fue rechazado o
            cancelado.
          </p>
        )}
        <p className="text-muted mb-8 text-sm">
          Podés intentar con otro medio de pago o volver a tu carrito.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/carrito"
            className="bg-primary text-surface inline-block px-8 py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
          >
            Volver al carrito
          </Link>
          <Link
            href="/tienda"
            className="border-border text-ink inline-block rounded border px-8 py-3 text-sm transition-colors hover:bg-zinc-50"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
