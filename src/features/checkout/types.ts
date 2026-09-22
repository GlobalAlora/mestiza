// Fase 4: multi-step checkout, Server Actions, Mercado Pago

export type ShippingType = 'delivery' | 'pickup' | 'theater_pickup';

export type CheckoutContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type CheckoutShippingData = {
  methodId: string;
  type: ShippingType;
  address?: {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  notes?: string;
};

export type CheckoutData = {
  contact: CheckoutContactData;
  shipping: CheckoutShippingData;
  ageVerified: boolean;
};
