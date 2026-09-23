'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function upsertContentBlock(key: string, value: Record<string, unknown>) {
  const db = createAdminClient();
  const { error } = await db
    .from('content_blocks')
    .upsert({ key, type: 'json', value: value as Json }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/contenido');
}
