'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminSession } from '@/lib/supabase/require-admin';
import type { Json } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function saveSection(entries: { key: string; text: string }[]) {
  await requireAdminSession();
  const db = createAdminClient();
  const rows = entries.map(({ key, text }) => ({
    key,
    type: 'text',
    value: { text } as Json,
  }));
  const { error } = await db.from('content_blocks').upsert(rows, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/historia');
  revalidatePath('/admin/contenido');
}
