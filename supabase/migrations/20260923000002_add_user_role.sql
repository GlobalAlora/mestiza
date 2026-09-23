-- Soy Mestiza — Fase 5: rol de usuario y bucket de imágenes

CREATE TYPE public.user_role AS ENUM ('customer', 'admin');

ALTER TABLE public.profiles
  ADD COLUMN role public.user_role NOT NULL DEFAULT 'customer';

-- Grant para que el trigger handle_new_user (ejecutado como postgres) pueda insertar con el valor por defecto
-- Los grants a anon/authenticated/service_role ya existen en migraciones anteriores.

-- Bucket público para imágenes de productos y categorías
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública del bucket
CREATE POLICY "products_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'products');
