'use server';

import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rawNext = formData.get('next') as string;
  const next = rawNext?.startsWith('/') ? rawNext : '/mi-cuenta';

  const rl = await checkRateLimit('login', email);
  if (!rl.ok) {
    redirect(
      `/mi-cuenta/login?error=${encodeURIComponent(rl.error)}&next=${encodeURIComponent(next)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/mi-cuenta/login?error=${encodeURIComponent('Email o contraseña incorrectos')}&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(next as '/mi-cuenta');
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  const rl = await checkRateLimit('register', email);
  if (!rl.ok) {
    redirect(`/mi-cuenta/registrarse?error=${encodeURIComponent(rl.error)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  });

  if (error) {
    redirect(`/mi-cuenta/registrarse?error=${encodeURIComponent(error.message)}`);
  }

  // Create profile row
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      first_name: firstName || null,
      last_name: lastName || null,
    });
  }

  redirect('/mi-cuenta');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/mi-cuenta/login');
}
