import { createHmac } from 'crypto';

/** Derives a deterministic session token from the configured admin password. */
export function adminToken(): string {
  const secret = process.env.ADMIN_SECRET ?? 'mestiza-admin-2025';
  const password = process.env.ADMIN_PASSWORD ?? '';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export const ADMIN_COOKIE = 'admin-auth';
