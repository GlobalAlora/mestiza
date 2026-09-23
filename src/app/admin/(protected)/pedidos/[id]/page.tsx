import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatusChanger } from '../_components/status-changer';

export const metadata = { title: 'Detalle de pedido' };

const paymentLabel: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  refunded: 'Reembolsado',
};
const shippingTypeLabel: Record<string, string> = {
  delivery: 'Envío a domicilio',
  pickup: 'Retiro en local',
  theater_pickup: 'Retiro en teatro',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();

  const [{ data: order }, { data: items }, { data: history }] = await Promise.all([
    db.from('orders').select('*').eq('id', id).single(),
    db.from('order_items').select('*').eq('order_id', id).order('id'),
    db
      .from('order_status_history')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (!order) notFound();

  const address = order.shipping_address as Record<string, string> | null;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/pedidos" className="text-muted hover:text-ink text-sm">
          ← Pedidos
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">Pedido {order.order_number ?? '—'}</h1>
        <p className="text-muted text-sm">{formatDate(order.created_at)}</p>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-ink mb-4 font-semibold">Productos</h2>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-muted pb-2 text-left font-medium">Producto</th>
                <th className="text-muted pb-2 text-center font-medium">Cant.</th>
                <th className="text-muted pb-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(items ?? []).map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <p className="text-ink font-medium">{item.product_name}</p>
                    <p className="text-muted text-xs">
                      {item.variant_name} · {item.sku}
                    </p>
                  </td>
                  <td className="py-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums">
                    {formatPrice(item.subtotal_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(order.subtotal_cents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Envío</span>
              <span>{formatPrice(order.shipping_cents)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary font-serif text-lg">
                {formatPrice(order.total_cents)}
              </span>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-ink mb-4 font-semibold">Datos del cliente</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted text-xs">Nombre</dt>
              <dd className="text-ink">
                {order.first_name} {order.last_name}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Email</dt>
              <dd className="text-ink">{order.email}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Teléfono</dt>
              <dd className="text-ink">{order.phone}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Pago</dt>
              <dd className="text-ink">{paymentLabel[order.payment_status]}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted text-xs">Tipo de envío</dt>
              <dd className="text-ink">
                {shippingTypeLabel[order.shipping_type] ?? order.shipping_type}
              </dd>
            </div>
            {address && (
              <div className="col-span-2">
                <dt className="text-muted text-xs">Dirección</dt>
                <dd className="text-ink">
                  {[address.street, address.city, address.province, address.zip]
                    .filter(Boolean)
                    .join(', ')}
                </dd>
              </div>
            )}
            {order.shipping_notes && (
              <div className="col-span-2">
                <dt className="text-muted text-xs">Notas</dt>
                <dd className="text-ink">{order.shipping_notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Cambiar estado */}
        <StatusChanger orderId={order.id} currentStatus={order.status} />

        {/* Historial */}
        {history && history.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-ink mb-4 font-semibold">Historial</h2>
            <ol className="border-border relative space-y-4 border-l">
              {history.map((h) => (
                <li key={h.id} className="ml-4">
                  <div className="bg-primary absolute -left-1.5 mt-1 h-3 w-3 rounded-full border border-white" />
                  <p className="text-ink text-sm font-medium">{h.status.replace('_', ' ')}</p>
                  {h.notes && <p className="text-muted text-xs">{h.notes}</p>}
                  <p className="text-muted text-xs">{formatDate(h.created_at)}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
