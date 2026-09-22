'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Creates a Supabase client for use in Client Components.
 * Uses the anon key — respects RLS policies.
 * Safe to call on every render (returns a stable singleton instance).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
