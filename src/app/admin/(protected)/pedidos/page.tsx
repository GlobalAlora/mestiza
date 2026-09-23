import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata = { title: 'Pedidos' };

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  ready_for_pickup: 'Listo para retiro',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};
const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  ready_for_pickup: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
const paymentColor: Record<string, string> = {
  pending: 'text-yellow-700',
  approved: 'text-green-700',
  rejected: 'text-red-700',
  refunded: 'text-purple-700',
};
const paymentLabel: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  refunded: 'Reembolsado',
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const db = createAdminClient();

  let query = db
    .from('orders')
    .select(
      'id, order_number, first_name, last_name, email, total_cents, status, payment_status, created_at',
    )
    .order('created_at', { ascending: false });

  const validStatuses = [
    'pending',
    'confirmed',
    'preparing',
    'shipped',
    'ready_for_pickup',
    'delivered',
    'cancelled',
  ] as const;
  type OrderStatus = (typeof validStatuses)[number];
  const validStatus = validStatuses.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;
  if (validStatus) query = query.eq('status', validStatus);

  const { data: orders } = await query;

  const statuses = Object.keys(statusLabel);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-ink text-2xl font-semibold">Pedidos</h1>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!status ? 'bg-primary text-surface' : 'text-ink border-border border bg-white hover:bg-zinc-50'}`}
        >
          Todos
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${status === s ? 'bg-primary text-surface' : 'text-ink border-border border bg-white hover:bg-zinc-50'}`}
          >
            {statusLabel[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {!orders || orders.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">
            No hay pedidos con ese estado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-muted px-6 py-3 text-left font-medium">N°</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Cliente</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Total</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Pago</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Estado</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Fecha</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-3 font-medium">
                      <Link
                        href={`/admin/pedidos/${o.id}`}
                        className="text-primary hover:underline"
                      >
                        {o.order_number ?? '—'}
                      </Link>
                    </td>
                    <td className="text-ink px-6 py-3">
                      <p>
                        {o.first_name} {o.last_name}
                      </p>
                      <p className="text-muted text-xs">{o.email}</p>
                    </td>
                    <td className="text-ink px-6 py-3 tabular-nums">
                      {formatPrice(o.total_cents)}
                    </td>
                    <td
                      className={`px-6 py-3 text-xs font-medium ${paymentColor[o.payment_status]}`}
                    >
                      {paymentLabel[o.payment_status]}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[o.status]}`}
                      >
                        {statusLabel[o.status]}
                      </span>
                    </td>
                    <td className="text-muted px-6 py-3 text-xs">{formatDate(o.created_at)}</td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/pedidos/${o.id}`}
                        className="text-primary text-xs hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
