import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Sidebar } from './_components/sidebar';

export const metadata: Metadata = {
  title: { template: '%s | Admin Soy Mestiza', default: 'Admin | Soy Mestiza' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/admin/login');

  const displayName =
    [profile.first_name, profile.last_name].filter(Boolean).join(' ') || user.email!;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100">
      <Sidebar displayName={displayName} userEmail={user.email!} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 pt-14 md:p-8 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
