import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { LoginForm } from './_components/login-form';

export const metadata: Metadata = buildMetadata({
  title: 'Iniciar sesión | Soy Mestiza',
  description: 'Iniciá sesión en tu cuenta de Soy Mestiza.',
  path: '/mi-cuenta/login',
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-ink mb-1 text-2xl font-semibold">Iniciá sesión</h1>
        <p className="text-muted mb-8 text-sm">
          ¿No tenés cuenta?{' '}
          <a href="/mi-cuenta/registrarse" className="text-primary underline">
            Registrate
          </a>
        </p>
        {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
