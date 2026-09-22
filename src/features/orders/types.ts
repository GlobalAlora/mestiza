// Fase 4-5: creación de pedidos, cambio de estado, emails

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'ready_for_pickup'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
