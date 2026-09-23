import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ResetPasswordForm } from './_components/reset-password-form';

export const metadata: Metadata = buildMetadata({
  title: 'Nueva contraseña | Soy Mestiza',
  description: 'Establecé una nueva contraseña para tu cuenta de Soy Mestiza.',
  path: '/mi-cuenta/reset-password',
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-ink mb-1 text-2xl font-semibold">Nueva contraseña</h1>
        <p className="text-muted mb-8 text-sm">Elegí una contraseña segura para tu cuenta.</p>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
