import { z } from 'zod';

/**
 * Validates all environment variables at startup.
 * Import `env` from here — never use process.env directly in application code.
 * This file is server-side only. Client components access NEXT_PUBLIC_* via process.env.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ── Site ─────────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // ── Supabase (public) ────────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // ── Supabase (server only — NEVER expose to client) ──────────────────────
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // ── Mercado Pago (required in production) ────────────────────────────────
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  // ── Email ─────────────────────────────────────────────────────────────────
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  // Destination for new-order notifications. Defaults to siteConfig.contact.email.
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),

  // ── Upstash Redis (rate limiting) ─────────────────────────────────────────
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // ── Cron ──────────────────────────────────────────────────────────────────
  CRON_SECRET: z.string().min(16).optional(),

  // ── Analytics (optional) ──────────────────────────────────────────────────
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  // ── Vercel ────────────────────────────────────────────────────────────────
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${message}\n\nSee .env.example for reference.`);
}

export const env = parsed.data;
