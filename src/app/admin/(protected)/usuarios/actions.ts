'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUserAction(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase();
  const password = formData.get('password') as string;
  const firstName = (formData.get('firstName') as string).trim();
  const lastName = (formData.get('lastName') as string).trim();
  const role = formData.get('role') as 'customer' | 'admin';

  const db = createAdminClient();

  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    redirect(
      `/admin/usuarios/nuevo?error=${encodeURIComponent(error?.message ?? 'Error al crear usuario')}`,
    );
  }

  await db.from('profiles').upsert({
    id: data.user.id,
    first_name: firstName || null,
    last_name: lastName || null,
    role,
  });

  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}

export async function updateUserAction(formData: FormData) {
  const id = formData.get('id') as string;
  const email = (formData.get('email') as string).trim().toLowerCase();
  const firstName = (formData.get('firstName') as string).trim();
  const lastName = (formData.get('lastName') as string).trim();
  const phone = (formData.get('phone') as string).trim();
  const role = formData.get('role') as 'customer' | 'admin';
  const newPassword = (formData.get('newPassword') as string).trim();

  const db = createAdminClient();

  // Update email in auth if changed
  const { error: authError } = await db.auth.admin.updateUserById(id, {
    email,
    ...(newPassword ? { password: newPassword } : {}),
  });

  if (authError) {
    redirect(`/admin/usuarios/${id}?error=${encodeURIComponent(authError.message)}`);
  }

  const { error: profileError } = await db.from('profiles').upsert({
    id,
    first_name: firstName || null,
    last_name: lastName || null,
    phone: phone || null,
    role,
  });

  if (profileError) {
    redirect(`/admin/usuarios/${id}?error=${encodeURIComponent(profileError.message)}`);
  }

  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}

export async function deleteUserAction(formData: FormData) {
  const id = formData.get('id') as string;
  const db = createAdminClient();
  const { error } = await db.auth.admin.deleteUser(id);
  if (error) {
    redirect(`/admin/usuarios?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}
