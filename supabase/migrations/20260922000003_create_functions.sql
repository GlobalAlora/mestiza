-- Soy Mestiza — Fase 2: funciones y triggers

-- ─────────────────────────────────────────
-- TRIGGER: updated_at automático
-- ─────────────────────────────────────────

create or replace function public.trigger_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplicar a todas las tablas con columna updated_at

create trigger set_updated_at before update on public.categories
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.products
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.product_variants
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.shipping_methods
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.orders
  for each row execute function public.trigger_set_updated_at();

create trigger set_updated_at before update on public.content_blocks
  for each row execute function public.trigger_set_updated_at();

-- ─────────────────────────────────────────
-- FUNCIÓN: generar order_number SM-YYYY-NNNNN
-- ─────────────────────────────────────────
-- Formato: SM-2026-00001
-- El contador no reseta por año (evita race conditions con sequences).
-- Para un volumen esperado < 99.999 pedidos/año es más que suficiente.

create or replace function public.generate_order_number()
returns text language plpgsql as $$
begin
  return 'SM-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('public.order_number_seq')::text, 5, '0');
end;
$$;

-- Trigger: asigna order_number en INSERT si no viene dado

create or replace function public.trigger_set_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null then
    new.order_number = public.generate_order_number();
  end if;
  return new;
end;
$$;

create trigger set_order_number before insert on public.orders
  for each row execute function public.trigger_set_order_number();

-- ─────────────────────────────────────────
-- FUNCIÓN: decrement_stock — decremento atómico con validación
-- ─────────────────────────────────────────
-- Lanza excepción 'P0001' con hint = variant_id si stock insuficiente.
-- Llamar desde Server Action (createAdminClient) dentro de la misma transacción
-- junto con la creación del pedido.

create or replace function public.decrement_stock(p_variant_id uuid, p_quantity integer)
returns void language plpgsql as $$
begin
  update public.product_variants
  set stock = stock - p_quantity
  where id = p_variant_id
    and stock >= p_quantity;

  if not found then
    raise exception 'insufficient_stock'
      using errcode = 'P0001',
            hint    = p_variant_id::text;
  end if;
end;
$$;

-- ─────────────────────────────────────────
-- FUNCIÓN: crear profile al registrar usuario
-- ─────────────────────────────────────────
-- Se ejecuta automáticamente cuando se crea un usuario en auth.users.

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
