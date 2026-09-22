// Fase 4-5: métodos de envío/retiro configurables desde admin

export type ShippingMethodType = 'delivery' | 'pickup' | 'theater_pickup';

export type ShippingZone = {
  type: 'provinces' | 'postal_codes';
  values: string[];
  base_rate_cents: number;
  per_kg_cents?: number;
  free_from_cents?: number;
};
