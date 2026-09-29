import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

function csvRow(cells: string[]): string {
  return cells.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',');
}

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'shipped',
  'ready_for_pickup',
  'delivered',
  'cancelled',
] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

function formatAddress(addr: unknown): string {
  if (!addr || typeof addr !== 'object') return '';
  const a = addr as Record<string, string>;
  const parts = [
    a.street && a.number ? `${a.street} ${a.number}${a.apartment ? ` ${a.apartment}` : ''}` : '',
    a.city ?? '',
    a.province ?? '',
    a.postalCode ? `CP ${a.postalCode}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');
  const validStatus = VALID_STATUSES.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('No autorizado', { status: 401 });

  const db = createAdminClient();
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return new NextResponse('Sin permisos', { status: 403 });

  let query = db
    .from('orders')
    .select(
      `order_number, first_name, last_name, email, phone,
       status, payment_status, shipping_type, shipping_address,
       subtotal_cents, shipping_cents, total_cents, created_at,
       order_items(product_name, variant_name, sku, quantity, unit_price_cents, subtotal_cents)`,
    )
    .order('created_at', { ascending: false });

  if (validStatus) query = query.eq('status', validStatus);

  const { data: orders } = await query;

  const header = csvRow([
    'N° Pedido',
    'Fecha',
    'Nombre',
    'Apellido',
    'Email',
    'Teléfono',
    'Estado pedido',
    'Estado pago',
    'Tipo envío',
    'Dirección',
    'Producto',
    'Variante',
    'SKU',
    'Cantidad',
    'Precio unit. (ARS)',
    'Subtotal ítem (ARS)',
    'Total pedido (ARS)',
  ]);

  type OrderItem = {
    product_name: string;
    variant_name: string;
    sku: string | null;
    quantity: number;
    unit_price_cents: number;
    subtotal_cents: number;
  };

  const rows: string[] = [header];

  for (const order of orders ?? []) {
    const items = (order.order_items as OrderItem[]) ?? [];
    const date = new Date(order.created_at).toLocaleDateString('es-AR');
    const address = formatAddress(order.shipping_address);

    if (items.length === 0) {
      rows.push(
        csvRow([
          String(order.order_number ?? ''),
          date,
          order.first_name,
          order.last_name,
          order.email,
          order.phone ?? '',
          order.status,
          order.payment_status,
          order.shipping_type,
          address,
          '',
          '',
          '',
          '',
          '',
          '',
          (order.total_cents / 100).toFixed(2),
        ]),
      );
    } else {
      for (const item of items) {
        rows.push(
          csvRow([
            String(order.order_number ?? ''),
            date,
            order.first_name,
            order.last_name,
            order.email,
            order.phone ?? '',
            order.status,
            order.payment_status,
            order.shipping_type,
            address,
            item.product_name,
            item.variant_name,
            item.sku ?? '',
            String(item.quantity),
            (item.unit_price_cents / 100).toFixed(2),
            (item.subtotal_cents / 100).toFixed(2),
            (order.total_cents / 100).toFixed(2),
          ]),
        );
      }
    }
  }

  const csv = '﻿' + rows.join('\n');
  const filename = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
