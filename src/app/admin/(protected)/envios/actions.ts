'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShippingMethod(formData: FormData) {
  const db = createAdminClient();
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'delivery' | 'pickup' | 'theater_pickup';
  const is_active = formData.get('is_active') === 'true';
  const position = parseInt((formData.get('position') as string) || '0');
  const zonesJson = (formData.get('zones') as string) || '[]';
  const zones = JSON.parse(zonesJson);

  const { error } = await db
    .from('shipping_methods')
    .insert({ name, type, is_active, position, zones });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/envios');
  redirect('/admin/envios');
}

export async function updateShippingMethod(id: string, formData: FormData) {
  const db = createAdminClient();
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'delivery' | 'pickup' | 'theater_pickup';
  const is_active = formData.get('is_active') === 'true';
  const position = parseInt((formData.get('position') as string) || '0');
  const zonesJson = (formData.get('zones') as string) || '[]';
  const zones = JSON.parse(zonesJson);

  const { error } = await db
    .from('shipping_methods')
    .update({ name, type, is_active, position, zones })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/envios');
  redirect('/admin/envios');
}

export async function deleteShippingMethod(id: string) {
  const db = createAdminClient();
  await db.from('shipping_methods').delete().eq('id', id);
  revalidatePath('/admin/envios');
}

export async function toggleShippingActive(id: string, is_active: boolean) {
  const db = createAdminClient();
  await db.from('shipping_methods').update({ is_active: !is_active }).eq('id', id);
  revalidatePath('/admin/envios');
}
