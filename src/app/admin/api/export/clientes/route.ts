import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

function csvRow(cells: string[]): string {
  return cells.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',');
}

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('No autorizado', { status: 401 });

  const db = createAdminClient();
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return new NextResponse('Sin permisos', { status: 403 });

  const { data: orders } = await db
    .from('orders')
    .select('email, first_name, last_name, phone, total_cents, status, created_at')
    .order('created_at', { ascending: false });

  type CustomerRecord = {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    orderCount: number;
    totalSpent: number;
    firstOrder: string;
    lastOrder: string;
  };

  const map = new Map<string, CustomerRecord>();

  for (const o of orders ?? []) {
    const existing = map.get(o.email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.total_cents;
      if (o.created_at < existing.firstOrder) existing.firstOrder = o.created_at;
      if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
    } else {
      map.set(o.email, {
        email: o.email,
        firstName: o.first_name,
        lastName: o.last_name,
        phone: o.phone ?? '',
        orderCount: 1,
        totalSpent: o.total_cents,
        firstOrder: o.created_at,
        lastOrder: o.created_at,
      });
    }
  }

  const customers = Array.from(map.values()).sort(
    (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime(),
  );

  const header = csvRow([
    'Email',
    'Nombre',
    'Apellido',
    'Teléfono',
    'Pedidos',
    'Total gastado (ARS)',
    'Primer pedido',
    'Último pedido',
  ]);

  const rows: string[] = [header];

  for (const c of customers) {
    rows.push(
      csvRow([
        c.email,
        c.firstName,
        c.lastName,
        c.phone,
        String(c.orderCount),
        (c.totalSpent / 100).toFixed(2),
        new Date(c.firstOrder).toLocaleDateString('es-AR'),
        new Date(c.lastOrder).toLocaleDateString('es-AR'),
      ]),
    );
  }

  const csv = '﻿' + rows.join('\n');
  const filename = `clientes-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
