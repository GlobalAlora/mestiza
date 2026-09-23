-- Soy Mestiza — Grants adicionales para service_role
-- El proyecto fue creado con "Automatically expose new tables" desactivado,
-- por lo que service_role tampoco recibió grants automáticos.
-- service_role los necesita para triggers, webhooks, cron jobs y Server Actions de pedidos.

grant select, insert, update, delete on public.categories       to service_role;
grant select, insert, update, delete on public.products         to service_role;
grant select, insert, update, delete on public.product_variants to service_role;
grant select, insert, update, delete on public.product_images   to service_role;
grant select, insert, update, delete on public.shipping_methods to service_role;
grant select, insert, update, delete on public.content_blocks   to service_role;
grant select, insert, update, delete on public.profiles         to service_role;
grant select, insert, update, delete on public.orders           to service_role;
grant select, insert, update, delete on public.order_items      to service_role;
grant select, insert, update, delete on public.order_status_history to service_role;
grant all on sequence public.order_number_seq                   to service_role;
