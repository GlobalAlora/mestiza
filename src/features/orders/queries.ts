import { createAdminClient } from '@/lib/supabase/admin';

export type OrderSummary = {
  id: string;
  order_number: string | number | null;
  status: string;
  payment_status: string;
  total_cents: number;
  created_at: string;
  shipping_type: string;
};

export type OrderDetail = OrderSummary & {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_notes: string | null;
  shipping_address: Record<string, string> | null;
  subtotal_cents: number;
  shipping_cents: number;
  access_token: string;
  shipping_methods: { name: string } | null;
  order_items: Array<{
    id: string;
    product_name: string;
    variant_name: string;
    sku: string;
    quantity: number;
    unit_price_cents: number;
    subtotal_cents: number;
  }>;
};

export async function getOrdersByUserId(userId: string): Promise<OrderSummary[]> {
  const db = createAdminClient();
  const { data } = await db
    .from('orders')
    .select('id, order_number, status, payment_status, total_cents, created_at, shipping_type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as OrderSummary[];
}

export async function getOrderByIdForUser(
  orderId: string,
  userId: string,
): Promise<OrderDetail | null> {
  const db = createAdminClient();
  const { data } = await db
    .from('orders')
    .select(
      `id, order_number, status, payment_status, total_cents, created_at, shipping_type,
       first_name, last_name, email, phone, shipping_notes, shipping_address,
       subtotal_cents, shipping_cents, access_token,
       shipping_methods(name),
       order_items(id, product_name, variant_name, sku, quantity, unit_price_cents, subtotal_cents)`,
    )
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();
  if (!data) return null;
  return data as unknown as OrderDetail;
}
