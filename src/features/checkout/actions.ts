'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { createMpPreference } from '@/lib/mercadopago';
import { sendOrderReceivedEmail, sendNewOrderAdminEmail } from '@/lib/email';
import { checkRateLimit } from '@/lib/ratelimit';
import { siteConfig } from '@/config/site';
import type { ActiveShippingMethod } from './queries';

const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
});

const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  apartment: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
});

const uuidSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'ID inválido');

const cartItemSchema = z.object({
  variantId: uuidSchema,
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  contact: contactSchema,
  shippingMethodId: uuidSchema,
  address: addressSchema.optional(),
  notes: z.string().max(500).optional(),
  ageVerified: z.boolean().refine((v) => v, { message: 'Debés confirmar tu edad' }),
  items: z.array(cartItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof checkoutSchema>;

export type CreateOrderResult =
  { ok: true; accessToken: string; initPoint: string | null } | { ok: false; error: string };

function calcShippingCents(method: ActiveShippingMethod, subtotalCents: number): number {
  if (method.type === 'pickup' || method.type === 'theater_pickup') return 0;
  const zone = method.zones?.[0];
  if (!zone) return 0;
  if (zone.free_from_cents != null && subtotalCents >= zone.free_from_cents) return 0;
  return zone.base_rate_cents;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const data = parsed.data;

  const rl = await checkRateLimit('checkout', data.contact.email);
  if (!rl.ok) return { ok: false, error: rl.error };

  const db = createAdminClient();

  // Re-fetch all variant prices from DB — never trust client prices
  const variantIds = data.items.map((i) => i.variantId);
  const { data: variants, error: varErr } = await db
    .from('product_variants')
    .select('id, name, sku, price_cents, products(name)')
    .in('id', variantIds);

  if (varErr || !variants?.length) {
    return { ok: false, error: 'No se pudieron verificar los productos' };
  }

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  // Verify all requested variants exist
  for (const item of data.items) {
    if (!variantMap.has(item.variantId)) {
      return { ok: false, error: `Producto no encontrado: ${item.variantId}` };
    }
  }

  // Fetch shipping method
  const { data: shippingMethod, error: smErr } = await db
    .from('shipping_methods')
    .select('id, name, type, zones, is_active')
    .eq('id', data.shippingMethodId)
    .single();

  if (smErr || !shippingMethod?.is_active) {
    return { ok: false, error: 'Método de envío no disponible' };
  }

  // Build order items + recalculate totals
  const orderItems = data.items.map((item) => {
    const v = variantMap.get(item.variantId)!;
    const products = v.products as { name: string } | null;
    return {
      variant_id: item.variantId,
      product_name: products?.name ?? '',
      variant_name: v.name,
      sku: v.sku,
      quantity: item.quantity,
      unit_price_cents: v.price_cents,
      subtotal_cents: v.price_cents * item.quantity,
    };
  });

  const subtotalCents = orderItems.reduce((sum, i) => sum + i.subtotal_cents, 0);
  const shippingCents = calcShippingCents(
    shippingMethod as unknown as ActiveShippingMethod,
    subtotalCents,
  );
  const totalCents = subtotalCents + shippingCents;

  const accessToken = crypto.randomUUID().replace(/-/g, '');

  // Attach user_id if user is authenticated (so Mi cuenta can find the order)
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  const userId = user?.id ?? null;

  // Create order
  const { data: order, error: orderErr } = await db
    .from('orders')
    .insert({
      first_name: data.contact.firstName,
      last_name: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
      shipping_method_id: data.shippingMethodId,
      shipping_type: shippingMethod.type,
      shipping_address: data.address ?? null,
      shipping_notes: data.notes ?? null,
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      age_verified: data.ageVerified,
      access_token: accessToken,
      status: 'pending',
      user_id: userId,
    })
    .select('id, order_number')
    .single();

  if (orderErr || !order) {
    return { ok: false, error: 'Error al crear el pedido' };
  }

  // Create order items
  const { error: itemsErr } = await db
    .from('order_items')
    .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

  if (itemsErr) {
    return { ok: false, error: 'Error al guardar los productos del pedido' };
  }

  // Create MP preference if configured
  let initPoint: string | null = null;
  const mpResult = await createMpPreference({
    orderId: order.id,
    accessToken,
    items: orderItems.map((i) => ({
      title: `${i.product_name} — ${i.variant_name}`,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
    })),
    payer: {
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
    },
  });

  if (mpResult.ok) {
    initPoint = mpResult.initPoint;
    await db.from('orders').update({ mp_preference_id: mpResult.preferenceId }).eq('id', order.id);
  }

  const emailPayload = {
    orderNumber: String(order.order_number),
    firstName: data.contact.firstName,
    email: data.contact.email,
    items: orderItems.map((i) => ({
      productName: i.product_name,
      variantName: i.variant_name,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
    })),
    subtotalCents,
    shippingCents,
    totalCents,
    shippingMethod: shippingMethod.name,
  };

  // Email al cliente — confirmación de recepción
  sendOrderReceivedEmail(emailPayload).catch(() => {});

  // Email al admin — notificación de nuevo pedido
  // Destination: ADMIN_NOTIFICATION_EMAIL env var, fallback to siteConfig contact email
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? siteConfig.contact.email;
  sendNewOrderAdminEmail({ ...emailPayload, adminEmail }).catch(() => {});

  return { ok: true, accessToken, initPoint };
}
