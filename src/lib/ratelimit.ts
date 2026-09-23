import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { headers } from 'next/headers';

const PRESETS = {
  login: { requests: 5, window: '60 s' },
  register: { requests: 3, window: '60 s' },
  checkout: { requests: 5, window: '60 s' },
  contact: { requests: 3, window: '60 s' },
} as const;

export type RateLimitPreset = keyof typeof PRESETS;
type RateLimitResult = { ok: true } | { ok: false; error: string };

export async function checkRateLimit(
  preset: RateLimitPreset,
  identifier?: string,
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { ok: true };

  const config = PRESETS[preset];
  const redis = new Redis({ url, token });
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `mestiza:rl:${preset}`,
  });

  let id: string;
  if (identifier) {
    id = identifier;
  } else {
    const hdrs = await headers();
    const forwarded = hdrs.get('x-forwarded-for') ?? hdrs.get('x-real-ip') ?? 'unknown';
    id = (forwarded.split(',')[0] ?? 'unknown').trim();
  }

  const { success } = await ratelimit.limit(id);
  return success
    ? { ok: true }
    : { ok: false, error: 'Demasiados intentos. Intentá de nuevo en unos minutos.' };
}
