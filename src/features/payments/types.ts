// Fase 4: Mercado Pago Checkout Pro, webhook con validación x-signature

export type PaymentProvider = 'mercadopago';

export type MercadoPagoWebhookTopic = 'payment' | 'merchant_order' | 'point_integration_wh';
