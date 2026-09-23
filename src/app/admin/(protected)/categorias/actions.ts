'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminSession } from '@/lib/supabase/require-admin';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
  await requireAdminSession();
  const db = createAdminClient();
  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || slugify(name);
  const description = (formData.get('description') as string) || null;
  const position = parseInt((formData.get('position') as string) || '0');

  const { error } = await db.from('categories').insert({ name, slug, description, position });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/categorias');
  revalidatePath('/tienda');
  redirect('/admin/categorias');
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdminSession();
  const db = createAdminClient();
  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || slugify(name);
  const description = (formData.get('description') as string) || null;
  const position = parseInt((formData.get('position') as string) || '0');

  const { error } = await db
    .from('categories')
    .update({ name, slug, description, position })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/categorias');
  revalidatePath('/tienda');
  redirect('/admin/categorias');
}

export async function deleteCategory(id: string) {
  await requireAdminSession();
  const db = createAdminClient();
  const { error } = await db.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categorias');
  revalidatePath('/tienda');
}
