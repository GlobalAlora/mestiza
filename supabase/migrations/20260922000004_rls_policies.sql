-- Soy Mestiza — Fase 2: Row Level Security
--
-- Regla fundamental:
--   orders / order_items — SIN políticas INSERT para anon ni authenticated.
--   Los pedidos se crean SOLO desde Server Actions con service_role (createAdminClient).
--   service_role siempre bypasea RLS.
--
-- Acceso de invitados a su pedido: via Server Action con createAdminClient,
--   verificando access_token en el servidor. No necesita política RLS pública.

-- ─────────────────────────────────────────
-- CATEGORÍAS — lectura pública
-- ─────────────────────────────────────────

alter table public.categories enable row level security;

create policy "categories: lectura publica"
  on public.categories for select
  using (true);

-- ─────────────────────────────────────────
-- PRODUCTOS — publicados: lectura pública; admin: acceso total via service_role
-- ─────────────────────────────────────────

alter table public.products enable row level security;

create policy "products: lectura publica de publicados"
  on public.products for select
  using (status = 'published');

-- ─────────────────────────────────────────
-- VARIANTES DE PRODUCTO — lectura pública
-- ─────────────────────────────────────────

alter table public.product_variants enable row level security;

create policy "product_variants: lectura publica"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and p.status = 'published'
    )
  );

-- ─────────────────────────────────────────
-- IMÁGENES DE PRODUCTO — lectura pública
-- ─────────────────────────────────────────

alter table public.product_images enable row level security;

create policy "product_images: lectura publica"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and p.status = 'published'
    )
  );

-- ─────────────────────────────────────────
-- PERFILES — solo el propio usuario
-- ─────────────────────────────────────────

alter table public.profiles enable row level security;

create policy "profiles: lectura propia"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insercion propia"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: actualizacion propia"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────
-- MÉTODOS DE ENVÍO — activos: lectura pública
-- ─────────────────────────────────────────

alter table public.shipping_methods enable row level security;

create policy "shipping_methods: lectura publica de activos"
  on public.shipping_methods for select
  using (is_active = true);

-- ─────────────────────────────────────────
-- PEDIDOS — solo el usuario propietario puede ver sus pedidos
-- Sin INSERT para anon ni authenticated. Sin UPDATE ni DELETE.
-- ─────────────────────────────────────────

alter table public.orders enable row level security;

create policy "orders: usuario ve sus propios pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- ÍTEMS DE PEDIDO — via el pedido del usuario
-- ─────────────────────────────────────────

alter table public.order_items enable row level security;

create policy "order_items: usuario ve items de sus pedidos"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- HISTORIAL DE ESTADOS — via el pedido del usuario
-- ─────────────────────────────────────────

alter table public.order_status_history enable row level security;

create policy "order_status_history: usuario ve historial de sus pedidos"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- PAGOS — sin acceso directo (solo service_role via admin)
-- ─────────────────────────────────────────

alter table public.payments enable row level security;

-- Sin políticas = nadie excepto service_role puede acceder

-- ─────────────────────────────────────────
-- BLOQUES DE CONTENIDO — lectura pública
-- ─────────────────────────────────────────

alter table public.content_blocks enable row level security;

create policy "content_blocks: lectura publica"
  on public.content_blocks for select
  using (true);
