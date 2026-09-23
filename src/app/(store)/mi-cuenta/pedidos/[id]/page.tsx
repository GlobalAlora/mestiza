import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getOrderByIdForUser } from '@/features/orders/queries';
import { AccountNav } from '../../_components/account-nav';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Detalle de pedido | Soy Mestiza' };

const statusLabels: Record<string, string> = {
  pending: 'Pendiente de pago',
  confirmed: 'Pago confirmado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  ready_for_pickup: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const shippingTypeLabels: Record<string, string> = {
  delivery: 'Envío a domicilio',
  pickup: 'Retiro en local',
  theater_pickup: 'Retiro en teatro',
};

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) redirect('/mi-cuenta/login');

  const order = await getOrderByIdForUser(id, user.id);
  if (!order) notFound();

  const displayName = user.email?.split('@')[0] ?? 'Cliente';

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountNav displayName={displayName} email={user.email ?? ''} />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/mi-cuenta/pedidos"
                className="text-muted hover:text-ink mb-1 block text-xs"
              >
                ← Mis pedidos
              </Link>
              <h1 className="text-ink text-xl font-semibold">
                Pedido #{order.order_number ?? '—'}
              </h1>
              <p className="text-muted text-xs">{formatDate(order.created_at)}</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>

          {/* Items */}
          <div className="rounded border bg-white">
            <h2 className="border-b px-5 py-3 text-sm font-semibold">Productos</h2>
            <div className="divide-y">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-ink text-sm font-medium">{item.product_name}</p>
                    <p className="text-muted text-xs">
                      {item.variant_name} · SKU {item.sku} · ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-ink text-sm font-semibold tabular-nums">
                    {formatPrice(item.subtotal_cents)}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-1 border-t px-5 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">
                  {shippingTypeLabels[order.shipping_type] ?? 'Envío'}
                  {order.shipping_methods?.name ? ` — ${order.shipping_methods.name}` : ''}
                </span>
                <span>
                  {order.shipping_cents === 0 ? 'Gratis' : formatPrice(order.shipping_cents)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total_cents)}</span>
              </div>
            </div>
          </div>

          {/* Shipping info */}
          <div className="space-y-2 rounded border bg-white px-5 py-4">
            <h2 className="mb-3 text-sm font-semibold">Datos de entrega</h2>
            <p className="text-ink text-sm">
              {order.first_name} {order.last_name}
            </p>
            <p className="text-muted text-sm">
              {order.email} · {order.phone}
            </p>
            {order.shipping_type === 'delivery' && order.shipping_address && (
              <p className="text-muted text-sm">
                {(order.shipping_address as Record<string, string>).street}{' '}
                {(order.shipping_address as Record<string, string>).number}
                {(order.shipping_address as Record<string, string>).apartment
                  ? `, ${(order.shipping_address as Record<string, string>).apartment}`
                  : ''}
                , {(order.shipping_address as Record<string, string>).city},{' '}
                {(order.shipping_address as Record<string, string>).province}
              </p>
            )}
            {order.shipping_notes && (
              <p className="text-muted text-sm italic">{order.shipping_notes}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
