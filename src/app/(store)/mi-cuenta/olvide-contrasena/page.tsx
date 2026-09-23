import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { forgotPasswordAction } from './actions';

export const metadata: Metadata = buildMetadata({
  title: 'Recuperar contraseña | Soy Mestiza',
  description: 'Recuperá el acceso a tu cuenta de Soy Mestiza.',
  path: '/mi-cuenta/olvide-contrasena',
  noIndex: true,
});

type Props = { searchParams: Promise<{ error?: string; enviado?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, enviado } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-ink mb-1 text-2xl font-semibold">Recuperar contraseña</h1>
        <p className="text-muted mb-8 text-sm">
          Ingresá tu email y te enviamos un link para restablecer tu contraseña.
        </p>

        {enviado ? (
          <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Si el email existe en nuestro sistema, recibirás un link en los próximos minutos. Revisá
            también tu carpeta de spam.
          </div>
        ) : (
          <>
            {error && (
              <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>
            )}
            <form action={forgotPasswordAction} className="space-y-4">
              <div>
                <label className="text-ink mb-1 block text-sm font-medium">Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-surface w-full py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
              >
                Enviar link
              </button>
            </form>
          </>
        )}

        <p className="text-muted mt-6 text-center text-xs">
          <a href="/mi-cuenta/login" className="text-primary hover:underline">
            ← Volver al inicio de sesión
          </a>
        </p>
      </div>
    </main>
  );
}
