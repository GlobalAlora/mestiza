-- Soy Mestiza — Fase 2: tipos enumerados personalizados
-- Deben crearse antes que las tablas que los referencian

create type public.product_status as enum (
  'draft',
  'published',
  'archived'
);

create type public.order_status as enum (
  'pending',
  'confirmed',
  'preparing',
  'shipped',
  'ready_for_pickup',
  'delivered',
  'cancelled'
);

create type public.payment_status as enum (
  'pending',
  'approved',
  'rejected',
  'refunded'
);

create type public.shipping_method_type as enum (
  'delivery',
  'pickup',
  'theater_pickup'
);
