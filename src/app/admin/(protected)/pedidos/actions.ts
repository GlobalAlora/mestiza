'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Enums } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';
import { sendOrderStatusEmail } from '@/lib/email';

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

  // Send status update email to customer (fire and forget)
  const { data: order } = await db
    .from('orders')
    .select('email, first_name, order_number')
    .eq('id', orderId)
    .single();

  if (order) {
    sendOrderStatusEmail({
      status,
      orderNumber: String(order.order_number),
      firstName: order.first_name,
      email: order.email,
    }).catch(() => {});
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
}
