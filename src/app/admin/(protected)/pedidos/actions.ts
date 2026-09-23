'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Enums } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(
  orderId: string,
  status: Enums<'order_status'>,
  notes?: string,
) {
  const db = createAdminClient();

  await db.from('orders').update({ status }).eq('id', orderId);
  await db.from('order_status_history').insert({
    order_id: orderId,
    status,
    notes: notes || null,
  });

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
}
