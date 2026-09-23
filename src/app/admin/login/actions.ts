'use server';

import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rawNext = formData.get('next') as string;
  const next = rawNext?.startsWith('/') ? rawNext : '/admin';

  const rl = await checkRateLimit('login', email);
  if (!rl.ok) {
    redirect(`/admin/login?error=${encodeURIComponent(rl.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent('Credenciales inválidas')}`);
  }

  redirect(next as '/admin');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
