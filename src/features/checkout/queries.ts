import { createAdminClient } from '@/lib/supabase/admin';

export type ActiveShippingMethod = {
  id: string;
  name: string;
  type: 'delivery' | 'pickup' | 'theater_pickup';
  zones: Array<{
    type: string;
    values: string[];
    base_rate_cents: number;
    free_from_cents?: number;
  }>;
};

export async function getActiveShippingMethods(): Promise<ActiveShippingMethod[]> {
  const db = createAdminClient();
  const { data } = await db
    .from('shipping_methods')
    .select('id, name, type, zones')
    .eq('is_active', true)
    .order('position');
  return (data ?? []) as ActiveShippingMethod[];
}
