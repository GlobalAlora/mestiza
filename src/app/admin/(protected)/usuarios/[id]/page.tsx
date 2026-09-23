import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateUserAction } from '../actions';
import { DeleteUserButton } from './_components/delete-user-button';

export const metadata = { title: 'Editar usuario' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function EditarUsuarioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const db = createAdminClient();

  const [{ data: authUser, error: authErr }, { data: profile }] = await Promise.all([
    db.auth.admin.getUserById(id),
    db.from('profiles').select('*').eq('id', id).single(),
  ]);

  if (authErr || !authUser.user) notFound();

  const u = authUser.user;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/usuarios"
          className="text-muted hover:text-ink text-sm transition-colors"
        >
          ← Usuarios
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-ink text-xl font-semibold">Editar usuario</h1>
      </div>

      {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form action={updateUserAction} className="space-y-5">
          <input type="hidden" name="id" value={id} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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
              <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
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

          <div className="flex justify-end gap-3 pt-2">
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

      {/* Zona de peligro */}
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Zona de peligro</p>
        <p className="mt-1 text-xs text-red-600">
          Eliminar el usuario borra su cuenta y todos sus datos de acceso permanentemente.
        </p>
        <DeleteUserButton id={id} />
      </div>
    </div>
  );
}
