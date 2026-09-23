import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { updateUserAction } from '../actions';
import { DeleteUserButton } from './_components/delete-user-button';

export const metadata = { title: 'Editar usuario' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmado', cls: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Procesando', cls: 'bg-purple-100 text-purple-700' },
  shipped: { label: 'Enviado', cls: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Entregado', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', cls: 'bg-red-100 text-red-700' },
};

export default async function EditarUsuarioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const db = createAdminClient();

  const [{ data: authUser, error: authErr }, { data: profile }, { data: orders }] =
    await Promise.all([
      db.auth.admin.getUserById(id),
      db.from('profiles').select('*').eq('id', id).single(),
      db
        .from('orders')
        .select('id, order_number, status, total_cents, created_at, shipping_type')
        .eq('user_id', id)
        .order('created_at', { ascending: false }),
    ]);

  if (authErr || !authUser.user) notFound();

  const u = authUser.user;
  const totalSpent = (orders ?? []).reduce((sum, o) => sum + o.total_cents, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/usuarios"
          className="text-muted hover:text-ink text-sm transition-colors"
        >
          ← Usuarios
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-ink text-xl font-semibold">
          {profile?.first_name
            ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
            : u.email}
        </h1>
      </div>

      {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        {/* Datos del usuario */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-ink mb-4 text-sm font-semibold tracking-wide uppercase">
            Datos de la cuenta
          </h2>
          <form action={updateUserAction} className="space-y-4">
            <input type="hidden" name="id" value={id} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                  Nombre
                </label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={profile?.first_name ?? ''}
                  className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
                />
              </div>
              <div>
                <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                  Apellido
                </label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={profile?.last_name ?? ''}
                  className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                Teléfono
              </label>
              <input
                name="phone"
                type="tel"
                defaultValue={profile?.phone ?? ''}
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
              />
            </div>

            <div>
              <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={u.email ?? ''}
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
              />
            </div>

            <div>
              <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                Nueva contraseña
              </label>
              <input
                name="newPassword"
                type="password"
                minLength={8}
                placeholder="Dejar vacío para no cambiar"
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0"
              />
            </div>

            <div>
              <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
                Rol *
              </label>
              <select
                name="role"
                required
                defaultValue={profile?.role ?? 'customer'}
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
              >
                <option value="customer">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Link
                href="/admin/usuarios"
                className="rounded border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="bg-primary text-surface hover:bg-primary/90 rounded px-4 py-2 text-sm font-medium transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>

        {/* Stats rápidas */}
        <div className="flex flex-row gap-3 md:flex-col">
          <div className="min-w-[110px] rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-ink text-2xl font-semibold">{orders?.length ?? 0}</p>
            <p className="text-muted mt-0.5 text-xs">Pedidos</p>
          </div>
          <div className="min-w-[110px] rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-ink text-lg font-semibold">{formatPrice(totalSpent)}</p>
            <p className="text-muted mt-0.5 text-xs">Total gastado</p>
          </div>
          <div className="min-w-[110px] rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-ink text-xs font-medium">
              {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : 'Nunca'}
            </p>
            <p className="text-muted mt-0.5 text-xs">Último acceso</p>
          </div>
        </div>
      </div>

      {/* Historial de pedidos */}
      <div className="mt-6 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-ink text-sm font-semibold tracking-wide uppercase">
            Historial de pedidos
          </h2>
          {orders && orders.length > 0 && (
            <Link
              href={`/admin/pedidos?usuario=${id}`}
              className="text-primary text-xs hover:underline"
            >
              Ver todos
            </Link>
          )}
        </div>

        {!orders || orders.length === 0 ? (
          <p className="text-muted px-6 py-8 text-center text-sm">
            Este usuario no tiene pedidos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50">
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Pedido</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Fecha</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Estado</th>
                  <th className="text-muted px-6 py-3 text-left text-xs font-medium">Envío</th>
                  <th className="text-muted px-6 py-3 text-right text-xs font-medium">Total</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const st = STATUS_LABELS[order.status] ?? {
                    label: order.status,
                    cls: 'bg-zinc-100 text-zinc-600',
                  };
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50">
                      <td className="text-ink px-6 py-3 font-medium">
                        #{order.order_number ?? order.id.slice(0, 8)}
                      </td>
                      <td className="text-muted px-6 py-3 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="text-muted px-6 py-3 text-xs capitalize">
                        {order.shipping_type === 'theater_pickup' ? 'Retiro' : 'Envío'}
                      </td>
                      <td className="text-ink px-6 py-3 text-right font-medium">
                        {formatPrice(order.total_cents)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="text-primary text-xs hover:underline"
                        >
                          Ver
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

      {/* Zona de peligro */}
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Zona de peligro</p>
        <p className="mt-1 text-xs text-red-600">
          Eliminar el usuario borra su cuenta y todos sus datos de acceso permanentemente. Los
          pedidos existentes no se eliminan.
        </p>
        <div className="mt-3">
          <DeleteUserButton id={id} />
        </div>
      </div>
    </div>
  );
}
