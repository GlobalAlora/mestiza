import { createClient } from './server';
import { createAdminClient } from './admin';

export async function requireAdminSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  const db = createAdminClient();
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'admin') throw new Error('Sin permisos de administrador');
}
