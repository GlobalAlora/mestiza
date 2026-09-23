import { createAdminClient } from '@/lib/supabase/admin';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Clientes' };

type CustomerRow = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cents / 100);
}

export default async function CustomersPage() {
  const db = createAdminClient();
  const { data: orders } = await db
    .from('orders')
    .select('email, first_name, last_name, phone, total_cents, created_at')
    .order('created_at', { ascending: false });

  const map = new Map<string, CustomerRow>();

  for (const o of orders ?? []) {
    const existing = map.get(o.email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total_cents;
      if (o.created_at < existing.firstOrder) existing.firstOrder = o.created_at;
      if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
    } else {
      map.set(o.email, {
        email: o.email,
        firstName: o.first_name,
        lastName: o.last_name,
        phone: o.phone ?? '',
        orderCount: 1,
        totalSpent: o.total_cents,
        firstOrder: o.created_at,
        lastOrder: o.created_at,
      });
    }
  }

  const customers = Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime(),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-ink text-2xl font-semibold">Clientes</h1>
          <p className="text-muted mt-0.5 text-sm">{customers.length} clientes únicos</p>
        </div>
        <a
          href="/admin/api/export/clientes"
          className="bg-primary text-surface hover:bg-primary/90 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {customers.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">Aún no hay clientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-muted px-6 py-3 text-left font-medium">Cliente</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Teléfono</th>
                  <th className="text-muted px-6 py-3 text-right font-medium">Pedidos</th>
                  <th className="text-muted px-6 py-3 text-right font-medium">Total gastado</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Último pedido</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((c) => (
                  <tr key={c.email} className="hover:bg-zinc-50">
                    <td className="text-ink px-6 py-3">
                      <p className="font-medium">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-muted text-xs">{c.email}</p>
                    </td>
                    <td className="text-muted px-6 py-3 text-xs">{c.phone || '—'}</td>
                    <td className="text-ink px-6 py-3 text-right tabular-nums">{c.orderCount}</td>
                    <td className="text-ink px-6 py-3 text-right tabular-nums">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="text-muted px-6 py-3 text-xs">{formatDate(c.lastOrder)}</td>
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
