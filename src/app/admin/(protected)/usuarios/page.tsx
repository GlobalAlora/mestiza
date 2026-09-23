import { createAdminClient } from '@/lib/supabase/admin';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = { title: 'Usuarios' };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function UsuariosPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const db = createAdminClient();

  const [{ data: authData }, { data: profiles }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from('profiles').select('id, first_name, last_name, role, phone, created_at'),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const users = (authData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '',
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
    profile: profileMap.get(u.id) ?? null,
  }));

  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-ink text-2xl font-semibold">Usuarios</h1>
          <p className="text-muted mt-0.5 text-sm">{users.length} usuarios registrados</p>
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

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {users.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-muted px-6 py-3 text-left font-medium">Usuario</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Rol</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Último acceso</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Registrado</th>
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
