'use server';

import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get('email') as string).trim().toLowerCase();

  const rl = await checkRateLimit('register', email);
  if (!rl.ok) {
    redirect(`/mi-cuenta/olvide-contrasena?error=${encodeURIComponent(rl.error)}`);
  }

  const hdrs = await headers();
  const origin = hdrs.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/mi-cuenta/reset-password`,
  });

  // Always redirect to success — don't reveal whether the email exists
  redirect('/mi-cuenta/olvide-contrasena?enviado=1');
}
