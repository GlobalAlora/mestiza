-- Soy Mestiza — Grants explícitos de tabla
-- Necesario porque desactivamos "Automatically expose new tables" en la creación del proyecto.
-- Sin estos grants, anon/authenticated no pueden llegar ni a las políticas RLS.

-- ── Catálogo público (anon y authenticated) ──────────────────────────────────
grant select on public.categories       to anon, authenticated;
grant select on public.products         to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant select on public.product_images   to anon, authenticated;
grant select on public.shipping_methods to anon, authenticated;
grant select on public.content_blocks   to anon, authenticated;

-- ── Perfil propio (authenticated) ────────────────────────────────────────────
grant select, insert, update on public.profiles to authenticated;

-- ── Pedidos propios — solo lectura vía RLS (authenticated) ───────────────────
grant select on public.orders               to authenticated;
grant select on public.order_items          to authenticated;
grant select on public.order_status_history to authenticated;

-- ── Secuencia de order_number (service_role la usa vía trigger) ───────────────
grant usage on sequence public.order_number_seq to service_role;
