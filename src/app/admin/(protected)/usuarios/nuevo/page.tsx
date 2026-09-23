import Link from 'next/link';
import { createUserAction } from '../actions';

export const metadata = { title: 'Nuevo usuario' };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NuevoUsuarioPage({ searchParams }: Props) {
  const { error } = await searchParams;

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
        <h1 className="text-ink text-xl font-semibold">Nuevo usuario</h1>
      </div>

      {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <form action={createUserAction} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
                Nombre
              </label>
              <input
                name="firstName"
                type="text"
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
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
              Contraseña *
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-0"
            />
            <p className="text-muted mt-1 text-xs">Mínimo 8 caracteres.</p>
          </div>

          <div>
            <label className="text-ink mb-1 block text-xs font-medium tracking-wide uppercase">
              Rol *
            </label>
            <select
              name="role"
              required
              defaultValue="customer"
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
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
