import { createAdminClient } from '@/lib/supabase/admin';

export async function getContentMap(): Promise<Record<string, string>> {
  const db = createAdminClient();
  const { data } = await db.from('content_blocks').select('key, value');
  const map: Record<string, string> = {};
  for (const block of data ?? []) {
    const v = block.value as unknown;
    if (typeof v === 'string') {
      map[block.key] = v;
    } else if (typeof v === 'object' && v !== null && 'text' in v) {
      map[block.key] = String((v as Record<string, unknown>).text ?? '');
    }
  }
  return map;
}

// Returns value from DB or falls back to hardcoded default
export function c(map: Record<string, string>, key: string, fallback: string): string {
  return map[key]?.trim() || fallback;
}
