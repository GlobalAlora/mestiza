import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

async function getStats() {
  const db = createAdminClient();

  const [products, orders, categories, revenue] = await Promise.all([
    db.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    db.from('orders').select('id', { count: 'exact', head: true }),
    db.from('categories').select('id', { count: 'exact', head: true }),
    db.from('orders').select('total_cents').eq('payment_status', 'approved'),
  ]);

  const totalRevenue = (revenue.data ?? []).reduce((sum, o) => sum + o.total_cents, 0);

  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    categories: categories.count ?? 0,
    revenue: totalRevenue,
  };
}

async function getRecentOrders() {
  const db = createAdminClient();
  const { data } = await db
    .from('orders')
    .select('id, order_number, first_name, last_name, total_cents, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  return data ?? [];
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  shipped: 'Enviado',
  ready_for_pickup: 'Listo para retiro',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  ready_for_pickup: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()]);

  return (
    <div>
      <h1 className="text-ink mb-6 text-2xl font-semibold">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(
          [
            { label: 'Productos publicados', value: stats.products, href: '/admin/productos' },
            { label: 'Pedidos totales', value: stats.orders, href: '/admin/pedidos' },
            { label: 'Categorías', value: stats.categories, href: '/admin/categorias' },
            {
              label: 'Ventas aprobadas',
              value: formatPrice(stats.revenue),
              href: '/admin/pedidos',
            },
          ] as const
        ).map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="block rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-muted mb-1 text-xs font-medium tracking-wide uppercase">{label}</p>
            <p className="text-ink text-2xl font-bold tabular-nums">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-ink font-semibold">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-primary text-sm hover:underline">
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted px-6 py-8 text-center text-sm">Todavía no hay pedidos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="text-muted px-6 py-3 font-medium">Número</th>
                  <th className="text-muted px-6 py-3 font-medium">Cliente</th>
                  <th className="text-muted px-6 py-3 font-medium">Total</th>
                  <th className="text-muted px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {order.order_number ?? '—'}
                      </Link>
                    </td>
                    <td className="text-ink px-6 py-3">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="text-ink px-6 py-3 tabular-nums">
                      {formatPrice(order.total_cents)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? 'bg-zinc-100 text-zinc-800'}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(
          [
            { href: '/admin/productos/nuevo', label: '+ Nuevo producto' },
            { href: '/admin/categorias/nueva', label: '+ Nueva categoría' },
            { href: '/admin/envios/nueva', label: '+ Método de envío' },
          ] as const
        ).map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="border-border text-primary rounded-lg border bg-white px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-zinc-50"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
