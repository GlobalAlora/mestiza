-- Soy Mestiza — Fase 2: tablas principales
-- Precios siempre en centavos ARS (integer). 250000 = ARS 2.500

-- ─────────────────────────────────────────
-- CATEGORÍAS DE PRODUCTOS
-- ─────────────────────────────────────────

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_path  text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories (slug);

-- ─────────────────────────────────────────
-- PRODUCTOS
-- ─────────────────────────────────────────

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid references public.categories (id) on delete set null,
  name           text not null,
  slug           text not null unique,
  description    text,
  attributes     jsonb not null default '{}',
  status         public.product_status not null default 'draft',
  is_placeholder boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_products_slug     on public.products (slug);
create index if not exists idx_products_status   on public.products (status);
create index if not exists idx_products_category on public.products (category_id);

-- ─────────────────────────────────────────
-- VARIANTES DE PRODUCTO (presentaciones: 750ml, Caja x3, Caja x6, etc.)
-- ─────────────────────────────────────────

create table if not exists public.product_variants (
  id                     uuid primary key default gen_random_uuid(),
  product_id             uuid not null references public.products (id) on delete cascade,
  name                   text not null,
  sku                    text not null unique,
  price_cents            integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  stock                  integer not null default 0 check (stock >= 0),
  weight_grams           integer check (weight_grams > 0),
  position               integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists idx_variants_product on public.product_variants (product_id);
create index if not exists idx_variants_sku     on public.product_variants (sku);

-- ─────────────────────────────────────────
-- IMÁGENES DE PRODUCTO (Supabase Storage)
-- ─────────────────────────────────────────

create table if not exists public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text     text,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_images_product on public.product_images (product_id);

-- ─────────────────────────────────────────
-- PERFILES DE USUARIO (extiende auth.users)
-- ─────────────────────────────────────────

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- MÉTODOS DE ENVÍO
-- ─────────────────────────────────────────

create table if not exists public.shipping_methods (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       public.shipping_method_type not null,
  is_active  boolean not null default true,
  zones      jsonb not null default '[]',
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- PEDIDOS
-- ─────────────────────────────────────────

create sequence if not exists public.order_number_seq start 1;

create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  order_number         text unique,
  access_token         text not null unique default replace(gen_random_uuid()::text, '-', ''),
  user_id              uuid references auth.users (id) on delete set null,
  status               public.order_status not null default 'pending',
  payment_status       public.payment_status not null default 'pending',
  first_name           text not null,
  last_name            text not null,
  email                text not null,
  phone                text not null,
  shipping_method_id   uuid references public.shipping_methods (id) on delete set null,
  shipping_type        public.shipping_method_type not null,
  shipping_address     jsonb,
  shipping_notes       text,
  subtotal_cents       integer not null check (subtotal_cents >= 0),
  shipping_cents       integer not null default 0 check (shipping_cents >= 0),
  total_cents          integer not null check (total_cents >= 0),
  age_verified         boolean not null default false,
  mp_preference_id     text,
  mp_payment_id        text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_access_token on public.orders (access_token);
create index if not exists idx_orders_user_id      on public.orders (user_id);
create index if not exists idx_orders_status       on public.orders (status);
create index if not exists idx_orders_email        on public.orders (email);

-- ─────────────────────────────────────────
-- ÍTEMS DE PEDIDO (snapshot al momento de la compra)
-- ─────────────────────────────────────────

create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       uuid references public.products (id) on delete set null,
  variant_id       uuid references public.product_variants (id) on delete set null,
  product_name     text not null,
  variant_name     text not null,
  sku              text not null,
  quantity         integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  subtotal_cents   integer not null check (subtotal_cents >= 0)
);

create index if not exists idx_order_items_order on public.order_items (order_id);

-- ─────────────────────────────────────────
-- HISTORIAL DE ESTADOS DE PEDIDO
-- ─────────────────────────────────────────

create table if not exists public.order_status_history (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  status     public.order_status not null,
  notes      text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_status_history_order on public.order_status_history (order_id);

-- ─────────────────────────────────────────
-- PAGOS (registro de webhook de Mercado Pago)
-- ─────────────────────────────────────────

create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders (id) on delete cascade,
  provider            text not null default 'mercadopago',
  provider_payment_id text,
  amount_cents        integer check (amount_cents >= 0),
  status              public.payment_status not null default 'pending',
  raw_response        jsonb,
  created_at          timestamptz not null default now()
);

create index if not exists idx_payments_order    on public.payments (order_id);
create index if not exists idx_payments_provider on public.payments (provider_payment_id);

-- ─────────────────────────────────────────
-- BLOQUES DE CONTENIDO
-- ─────────────────────────────────────────

create table if not exists public.content_blocks (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  type       text not null,
  value      jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
