import { createAdminClient } from '@/lib/supabase/admin';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const metadata = { title: 'Usuarios' };

type Props = { searchParams: Promise<{ error?: string; rol?: string }> };

export default async function UsuariosPage({ searchParams }: Props) {
  const { error, rol } = await searchParams;
  const db = createAdminClient();

  const [{ data: authData }, { data: profiles }, { data: orderStats }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from('profiles').select('id, first_name, last_name, role, phone'),
    db.from('orders').select('user_id, total_cents').not('user_id', 'is', null),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const orderMap = new Map<string, { count: number; total: number }>();
  for (const o of orderStats ?? []) {
    if (!o.user_id) continue;
    const cur = orderMap.get(o.user_id) ?? { count: 0, total: 0 };
    orderMap.set(o.user_id, { count: cur.count + 1, total: cur.total + o.total_cents });
  }

  let users = (authData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '',
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
    profile: profileMap.get(u.id) ?? null,
    orders: orderMap.get(u.id) ?? { count: 0, total: 0 },
  }));

  if (rol === 'admin') users = users.filter((u) => u.profile?.role === 'admin');
  if (rol === 'customer')
    users = users.filter((u) => (u.profile?.role ?? 'customer') === 'customer');

  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalUsers = authData?.users?.length ?? 0;
  const totalCustomers = (authData?.users ?? []).filter(
    (u) => (profileMap.get(u.id)?.role ?? 'customer') === 'customer',
  ).length;
  const totalAdmins = totalUsers - totalCustomers;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-ink text-2xl font-semibold">Usuarios</h1>
          <p className="text-muted mt-0.5 text-sm">
            {totalUsers} en total · {totalCustomers} clientes · {totalAdmins} admins
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="bg-primary text-surface hover:bg-primary/90 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo usuario
        </Link>
      </div>

      {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}

      {/* Filtros por rol */}
      <div className="mb-4 flex gap-2">
        {[
          { label: 'Todos', value: '' },
          { label: 'Clientes', value: 'customer' },
          { label: 'Admins', value: 'admin' },
        ].map(({ label, value }) => (
          <Link
            key={value}
            href={`/admin/usuarios${value ? `?rol=${value}` : ''}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              (rol ?? '') === value
                ? 'bg-primary text-surface'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {users.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">No se encontraron usuarios.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-zinc-50">
                <tr>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Usuario</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Rol</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Pedidos</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">
                    Total gastado
                  </th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">
                    Último acceso
                  </th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Registrado</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => {
                  const name =
                    [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ') || '—';
                  const role = u.profile?.role ?? 'customer';
                  return (
                    <tr key={u.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-3">
                        <p className="text-ink font-medium">{name}</p>
                        <p className="text-muted text-xs">{u.email}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {role === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td className="text-ink px-6 py-3 text-xs font-medium">
                        {u.orders.count > 0 ? (
                          u.orders.count
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-ink px-6 py-3 text-xs">
                        {u.orders.total > 0 ? (
                          formatPrice(u.orders.total)
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-muted px-6 py-3 text-xs">
                        {u.lastSignIn ? formatDate(u.lastSignIn) : 'Nunca'}
                      </td>
                      <td className="text-muted px-6 py-3 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/admin/usuarios/${u.id}`}
                          className="text-primary text-xs font-medium hover:underline"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
