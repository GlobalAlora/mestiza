import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Pedido recibido — Soy Mestiza' };

type Props = {
  searchParams: Promise<{ access_token?: string }>;
};

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { access_token } = await searchParams;

  if (!access_token) {
    return <NotFound />;
  }

  const db = createAdminClient();
  const { data: order } = await db
    .from('orders')
    .select(
      'order_number, first_name, status, total_cents, shipping_method_id, shipping_methods(name)',
    )
    .eq('access_token', access_token)
    .single();

  if (!order) {
    return <NotFound />;
  }

  const shippingName = (order.shipping_methods as { name?: string } | null)?.name ?? '';

  const isPending = order.status === 'pending';

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="text-success mb-4 text-5xl">✓</div>
        <h1 className="text-ink mb-2 text-2xl font-semibold">
          {isPending ? '¡Pedido recibido!' : '¡Pago confirmado!'}
        </h1>
        <p className="text-muted mb-6 text-sm">
          Pedido <strong className="text-ink">#{order.order_number}</strong> — {order.first_name},
          gracias por tu compra.
        </p>

        <div className="border-border mb-8 space-y-2 rounded border p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Estado</span>
            <span className="text-ink font-medium">
              {isPending ? 'Esperando confirmación de pago' : 'Pago aprobado'}
            </span>
          </div>
          {shippingName && (
            <div className="flex justify-between">
              <span className="text-muted">Envío</span>
              <span className="text-ink">{shippingName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Total</span>
            <span className="text-ink font-semibold">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                order.total_cents / 100,
              )}
            </span>
          </div>
        </div>

        <p className="text-muted mb-8 text-xs">
          Te enviamos un email con los detalles de tu pedido. Si tenés preguntas, escribinos.
        </p>

        <Link
          href="/tienda"
          className="bg-primary text-surface inline-block px-8 py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
        >
          Seguir comprando
        </Link>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-muted mb-4 text-sm">Pedido no encontrado.</p>
        <Link href="/tienda" className="text-primary text-sm underline">
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
