import { loginAction } from './actions';

export const metadata = { title: 'Acceso admin | Soy Mestiza' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-primary font-serif text-3xl select-none">SM</p>
          <h1 className="text-ink mt-1 text-xl font-semibold">Panel de administración</h1>
        </div>

        <form action={loginAction} className="space-y-4 rounded-lg bg-white p-8 shadow-sm">
          <input type="hidden" name="next" value={next ?? '/admin'} />

          {error && <p className="bg-error/10 text-error rounded px-3 py-2 text-sm">{error}</p>}

          <div>
            <label className="text-ink mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-surface w-full py-2.5 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
