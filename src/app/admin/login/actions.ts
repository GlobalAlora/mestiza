'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminToken, ADMIN_COOKIE } from '../_lib';

export async function loginAction(_prev: unknown, formData: FormData) {
  const password = formData.get('password') as string;

  if (!password || !process.env.ADMIN_PASSWORD) {
    return { error: 'Contraseña incorrecta.' };
  }

  // Constant-time comparison to prevent timing attacks
  const expected = process.env.ADMIN_PASSWORD;
  if (password.length !== expected.length || password !== expected) {
    return { error: 'Contraseña incorrecta.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  });

  redirect('/admin/nav');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}
