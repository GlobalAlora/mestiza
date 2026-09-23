import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';
import type { Json } from '@/lib/supabase/types';

// Mercado Pago sends: x-signature header
// Format: "ts=<timestamp>,v1=<hmac_sha256>"
function verifyMpSignature(req: NextRequest, rawBody: string): boolean {
  const secret = env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return false;

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  if (!xSignature) return false;

  const parts = Object.fromEntries(
    xSignature.split(',').map((part) => {
      const eqIdx = part.indexOf('=');
      const k = eqIdx >= 0 ? part.slice(0, eqIdx).trim() : part.trim();
      const v = eqIdx >= 0 ? part.slice(eqIdx + 1).trim() : '';
      return [k, v];
    }),
  );

  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  // MP manifest: "id:{data.id};request-id:{x-request-id};ts:{ts};"
  // When body has data.id, use it; otherwise fall back to body hash
  let manifest = '';
  try {
    const parsed: { data?: { id?: string }; action?: string } = JSON.parse(rawBody);
    const dataId = parsed?.data?.id ?? '';
    manifest = `id:${dataId};request-id:${xRequestId ?? ''};ts:${ts};`;
  } catch {
    return false;
  }

  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();

  // Skip signature check in development without secret configured
  if (env.MERCADOPAGO_WEBHOOK_SECRET) {
    if (!verifyMpSignature(req, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let payload: { action?: string; data?: { id?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only process payment events
  if (payload.action !== 'payment.updated' && payload.action !== 'payment.created') {
    return NextResponse.json({ ok: true });
  }

  const paymentId = payload.data?.id;
  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  // Fetch payment details from MP
  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json({ ok: true });
  }

  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!mpRes.ok) {
    return NextResponse.json({ error: 'MP fetch failed' }, { status: 502 });
  }

  const payment: {
    id: number;
    status: string;
    external_reference: string;
    transaction_amount: number;
  } = await mpRes.json();

  const orderId = payment.external_reference;
  if (!orderId) {
    return NextResponse.json({ ok: true });
  }

  const db = createAdminClient();

  // Map MP status to our payment_status enum
  const statusMap: Record<string, string> = {
    approved: 'approved',
    rejected: 'rejected',
    refunded: 'refunded',
    pending: 'pending',
    in_process: 'pending',
    authorized: 'pending',
  };

  const paymentStatus = statusMap[payment.status] ?? 'pending';

  type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
  const typedStatus = (paymentStatus as PaymentStatus) ?? ('pending' as PaymentStatus);

  // Upsert payment record
  await db.from('payments').upsert(
    {
      order_id: orderId,
      provider: 'mercadopago',
      provider_payment_id: String(payment.id),
      amount_cents: Math.round(payment.transaction_amount * 100),
      status: typedStatus,
      raw_response: payment as unknown as Json,
    },
    { onConflict: 'provider_payment_id' },
  );

  // Update order status on approval
  if (paymentStatus === 'approved') {
    await db
      .from('orders')
      .update({ status: 'confirmed', mp_payment_id: String(payment.id) })
      .eq('id', orderId);
  }

  return NextResponse.json({ ok: true });
}
