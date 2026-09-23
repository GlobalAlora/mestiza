import { Resend } from 'resend';
import { env } from '../env';

function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  return new Resend(env.RESEND_API_KEY);
}

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const client = getResendClient();
  if (!client || !env.RESEND_FROM_EMAIL) return;

  await client.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cents / 100);
}

type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  email: string;
  items: Array<{
    productName: string;
    variantName: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingMethod: string;
};

export async function sendOrderReceivedEmail(data: OrderEmailData): Promise<void> {
  const itemsHtml = data.items
    .map(
      (i) =>
        `<tr>
          <td>${i.productName} — ${i.variantName}</td>
          <td>${i.quantity}</td>
          <td>${formatCents(i.unitPriceCents)}</td>
          <td>${formatCents(i.unitPriceCents * i.quantity)}</td>
        </tr>`,
    )
    .join('');

  const html = `
    <h2>¡Gracias por tu pedido, ${data.firstName}!</h2>
    <p>Recibimos tu pedido <strong>#${data.orderNumber}</strong>.
    Te confirmamos cuando se acredite el pago.</p>
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
      <thead>
        <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p>Subtotal: ${formatCents(data.subtotalCents)}</p>
    <p>Envío (${data.shippingMethod}): ${formatCents(data.shippingCents)}</p>
    <p><strong>Total: ${formatCents(data.totalCents)}</strong></p>
  `;

  await sendEmail({
    to: data.email,
    subject: `Pedido #${data.orderNumber} recibido — Soy Mestiza`,
    html,
  });
}

export async function sendNewOrderAdminEmail(
  data: OrderEmailData & { adminEmail: string },
): Promise<void> {
  const html = `
    <h2>Nuevo pedido #${data.orderNumber}</h2>
    <p>Cliente: ${data.firstName} &lt;${data.email}&gt;</p>
    <p>Total: <strong>${formatCents(data.totalCents)}</strong></p>
    <p>Envío: ${data.shippingMethod}</p>
  `;

  await sendEmail({
    to: data.adminEmail,
    subject: `Nuevo pedido #${data.orderNumber} — Soy Mestiza`,
    html,
  });
}
