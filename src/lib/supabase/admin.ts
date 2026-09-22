import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env } from '@/lib/env';

/**
 * Creates a Supabase client with the service_role key.
 * Bypasses RLS — use ONLY in:
 *   - Server Actions that create/modify orders (price recalculation)
 *   - Webhook handlers (Mercado Pago)
 *   - Admin panel mutations
 *   - Cron jobs
 *
 * NEVER import this in Client Components or expose to the browser.
 */
export function createAdminClient() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
