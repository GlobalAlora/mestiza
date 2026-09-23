import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { getContentMap, c } from '@/lib/content';

export const metadata = { title: 'Pedido recibido — Soy Mestiza' };

type Props = {
  searchParams: Promise<{ access_token?: string }>;
};

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { access_token } = await searchParams;
  const content = await getContentMap();

  if (!access_token) {
    return <NotFound content={content} />;
  }

  const db = createAdminClient();
  const { data: order } = await db
    .from('orders')
    .select(
      'order_number, first_name, status, total_cents, shipping_method_id, shipping_methods(name)',
    )
    .eq('access_token', access_token)
    .single();

  if (!order) {
    return <NotFound content={content} />;
  }

  const shippingName = (order.shipping_methods as { name?: string } | null)?.name ?? '';
  const isPending = order.status === 'pending';

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="text-success mb-4 text-5xl">✓</div>
        <h1 className="text-ink mb-2 text-2xl font-semibold">
          {isPending
            ? c(content, 'confirmacion.title_pending', '¡Pedido recibido!')
            : c(content, 'confirmacion.title_confirmed', '¡Pago confirmado!')}
        </h1>
        <p className="text-muted mb-6 text-sm">
          Pedido <strong className="text-ink">#{order.order_number}</strong> — {order.first_name},{' '}
          {c(content, 'confirmacion.thanks_suffix', 'gracias por tu compra.')}
        </p>

        <div className="border-border mb-8 space-y-2 rounded border p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{c(content, 'confirmacion.label_estado', 'Estado')}</span>
            <span className="text-ink font-medium">
              {isPending
                ? c(content, 'confirmacion.status_pending', 'Esperando confirmación de pago')
                : c(content, 'confirmacion.status_confirmed', 'Pago aprobado')}
            </span>
          </div>
          {shippingName && (
            <div className="flex justify-between">
              <span className="text-muted">{c(content, 'confirmacion.label_envio', 'Envío')}</span>
              <span className="text-ink">{shippingName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">{c(content, 'confirmacion.label_total', 'Total')}</span>
            <span className="text-ink font-semibold">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                order.total_cents / 100,
              )}
            </span>
          </div>
        </div>

        <p className="text-muted mb-8 text-xs">
          {c(
            content,
            'confirmacion.email_notice',
            'Te enviamos un email con los detalles de tu pedido. Si tenés preguntas, escribinos.',
          )}
        </p>

        <Link
          href="/tienda"
          className="bg-primary text-surface inline-block px-8 py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
        >
          {c(content, 'confirmacion.cta_shopping', 'Seguir comprando')}
        </Link>
      </div>
    </main>
  );
}

function NotFound({ content }: { content: Record<string, string> }) {
  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-muted mb-4 text-sm">
          {c(content, 'confirmacion.not_found', 'Pedido no encontrado.')}
        </p>
        <Link href="/tienda" className="text-primary text-sm underline">
          {c(content, 'confirmacion.not_found_cta', 'Volver a la tienda')}
        </Link>
      </div>
    </main>
  );
}
