import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { createClient } from '@/lib/supabase/server';
import { getOrdersByUserId } from '@/features/orders/queries';
import { AccountNav } from '../_components/account-nav';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Mis pedidos | Soy Mestiza',
  description: 'Seguí el estado de tus pedidos.',
  path: '/mi-cuenta/pedidos',
  noIndex: true,
});

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  ready_for_pickup: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  ready_for_pickup: 'bg-teal-100 text-teal-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function MisPedidosPage() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) redirect('/mi-cuenta/login');

  const orders = await getOrdersByUserId(user.id);

  const displayName = user.email?.split('@')[0] ?? 'Cliente';

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountNav displayName={displayName} email={user.email ?? ''} />

        <div className="flex-1">
          <h1 className="text-ink mb-6 text-xl font-semibold">Mis pedidos</h1>

          {orders.length === 0 ? (
            <div className="rounded border bg-white p-8 text-center">
              <p className="text-muted mb-4 text-sm">Todavía no realizaste pedidos.</p>
              <Link
                href="/tienda"
                className="bg-primary text-surface inline-block px-6 py-2.5 text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/mi-cuenta/pedidos/${order.id}`}
                  className="border-border flex items-center justify-between rounded border bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div>
                    <p className="text-ink text-sm font-medium">
                      Pedido #{order.order_number ?? '—'}
                    </p>
                    <p className="text-muted text-xs">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? 'bg-zinc-100 text-zinc-800'}`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                    <p className="text-ink text-sm font-semibold tabular-nums">
                      {formatPrice(order.total_cents)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
