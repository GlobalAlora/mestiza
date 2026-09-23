import { MercadoPagoConfig, Preference } from 'mercadopago';
import { env } from './env';

function getMpClient(): MercadoPagoConfig | null {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) return null;
  return new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
}

export type MpPreferenceInput = {
  orderId: string;
  accessToken: string;
  items: Array<{
    title: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  payer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

export type MpPreferenceResult =
  { ok: true; preferenceId: string; initPoint: string } | { ok: false; error: string };

export async function createMpPreference(input: MpPreferenceInput): Promise<MpPreferenceResult> {
  const client = getMpClient();
  if (!client) {
    return { ok: false, error: 'Mercado Pago no configurado' };
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const confirmUrl = `${siteUrl}/checkout/confirmacion?access_token=${input.accessToken}`;
  const failUrl = `${siteUrl}/checkout/fallido?access_token=${input.accessToken}`;

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: input.items.map((item) => ({
          id: item.title,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPriceCents / 100,
          currency_id: 'ARS',
        })),
        payer: {
          name: input.payer.firstName,
          surname: input.payer.lastName,
          email: input.payer.email,
          phone: { number: input.payer.phone, area_code: '' },
        },
        back_urls: {
          success: confirmUrl,
          failure: failUrl,
          pending: confirmUrl,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/mp/webhook`,
        external_reference: input.orderId,
        metadata: { access_token: input.accessToken },
      },
    });

    if (!result.id || !result.init_point) {
      return { ok: false, error: 'MP no devolvió preference válida' };
    }

    return { ok: true, preferenceId: result.id, initPoint: result.init_point };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error MP desconocido' };
  }
}
