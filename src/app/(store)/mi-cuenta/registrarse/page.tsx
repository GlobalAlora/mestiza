import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { createClient } from '@/lib/supabase/server';
import { RegisterForm } from './_components/register-form';

export const metadata: Metadata = buildMetadata({
  title: 'Crear cuenta | Soy Mestiza',
  description: 'Creá tu cuenta para gestionar tus pedidos en Soy Mestiza.',
  path: '/mi-cuenta/registrarse',
  noIndex: true,
});

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegistrarsePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/mi-cuenta');

  const { error } = await searchParams;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-ink mb-1 text-2xl font-semibold">Crear cuenta</h1>
        <p className="text-muted mb-8 text-sm">
          ¿Ya tenés cuenta?{' '}
          <a href="/mi-cuenta/login" className="text-primary underline">
            Iniciá sesión
          </a>
        </p>
        {error && <p className="text-error mb-4 rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}
        <RegisterForm />
      </div>
    </main>
  );
}
