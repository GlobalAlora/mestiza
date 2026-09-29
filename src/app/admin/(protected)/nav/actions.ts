'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminSession } from '@/lib/supabase/require-admin';

type NavItem = { label: string; href: string };

export async function saveNavAction(items: NavItem[]) {
  await requireAdminSession();

  if (!items.length) return { error: 'El menú no puede estar vacío.' };

  for (const item of items) {
    if (!item.label.trim()) return { error: 'Cada ítem debe tener un nombre.' };
    if (!item.href.trim()) return { error: 'Cada ítem debe tener una URL.' };
    if (!item.href.startsWith('/')) return { error: `La URL "${item.href}" debe empezar con /.` };
  }

  const db = createAdminClient();
  const value = JSON.stringify(items);

  const { error } = await db
    .from('content_blocks')
    .upsert({ key: 'nav.main_items', type: 'json', value }, { onConflict: 'key' });

  if (error) return { error: `Error al guardar: ${error.message}` };

  revalidatePath('/', 'layout');

  return { success: true };
}
