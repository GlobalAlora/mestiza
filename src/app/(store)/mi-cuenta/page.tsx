import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AccountNav } from './_components/account-nav';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Mi cuenta | Soy Mestiza',
  description: 'Gestioná tu cuenta de Soy Mestiza.',
  path: '/mi-cuenta',
  noIndex: true,
});

export default async function MiCuentaPage() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) redirect('/mi-cuenta/login');

  const db = createAdminClient();
  const { data: profile } = await db
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    user.email?.split('@')[0] ||
    'Cliente';

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-8 md:flex-row">
        <AccountNav displayName={displayName} email={user.email ?? ''} />

        <div className="flex-1">
          <h1 className="text-ink mb-6 text-xl font-semibold">Mi perfil</h1>

          <div className="space-y-4 rounded border bg-white p-6">
            <div>
              <p className="text-muted mb-1 text-xs tracking-wider uppercase">Nombre</p>
              <p className="text-ink text-sm">{displayName}</p>
            </div>
            <div>
              <p className="text-muted mb-1 text-xs tracking-wider uppercase">Email</p>
              <p className="text-ink text-sm">{user.email}</p>
            </div>
            <div>
              <p className="text-muted mb-1 text-xs tracking-wider uppercase">Cuenta creada</p>
              <p className="text-ink text-sm">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
