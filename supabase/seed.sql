-- Soy Mestiza — Seed de desarrollo
-- is_placeholder = true marca datos que se reemplazarán antes del lanzamiento.
-- Ejecutar: pnpm supabase db reset (local) | pnpm supabase db push (remoto staging)

-- ─────────────────────────────────────────
-- CATEGORÍAS
-- ─────────────────────────────────────────

insert into public.categories (id, name, slug, description, position) values
  ('00000000-0000-0000-0000-000000000001', 'Vinos', 'vinos', 'Vinos de altura del Valle de Calingasta, San Juan.', 1),
  ('00000000-0000-0000-0000-000000000002', 'Cajas', 'cajas', 'Combinaciones especiales para regalo o abastecimiento.', 2);

-- ─────────────────────────────────────────
-- PRODUCTOS (placeholders — sin imágenes definitivas aún)
-- ─────────────────────────────────────────

insert into public.products (id, category_id, name, slug, description, attributes, status, is_placeholder) values
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Soy Mestiza Malbec',
    'soy-mestiza-malbec',
    'Malbec de altura del Valle de Calingasta (1.200 msnm). Notas de frutas rojas maduras, violetas y un toque especiado. Ideal para carnes rojas y quesos curados.',
    '{
      "varietal": "Malbec",
      "vintage_year": 2023,
      "region": "Valle de Calingasta, San Juan",
      "altitude_masl": 1200,
      "tasting_notes": "Frutas rojas maduras, violetas, toque especiado. Taninos suaves y final persistente.",
      "pairing": "Carnes rojas, quesos curados, pastas con salsa roja.",
      "alcohol_pct": 14.0,
      "producer": "Soy Mestiza — Como el vino"
    }'::jsonb,
    'published',
    true
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Soy Mestiza Cabernet Franc',
    'soy-mestiza-cabernet-franc',
    'Cabernet Franc de altura del Valle de Calingasta. Elegante y aromático, con notas herbales, pimienta verde y frutos rojos. Versátil en la mesa.',
    '{
      "varietal": "Cabernet Franc",
      "vintage_year": 2023,
      "region": "Valle de Calingasta, San Juan",
      "altitude_masl": 1200,
      "tasting_notes": "Pimiento, pimienta verde, frutos rojos. Cuerpo medio, acidez fresca y taninos finos.",
      "pairing": "Cordero, cerdo, vegetales asados, tablas de quesos.",
      "alcohol_pct": 13.5,
      "producer": "Soy Mestiza — Como el vino"
    }'::jsonb,
    'published',
    true
  );

-- ─────────────────────────────────────────
-- VARIANTES (750ml + Caja x3 + Caja x6 por producto)
-- Precios placeholder — actualizar antes del lanzamiento
-- ─────────────────────────────────────────

insert into public.product_variants (id, product_id, name, sku, price_cents, stock, weight_grams, position) values
  -- Malbec
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '750 ml',   'SM-MAL-750',   250000,  50, 1250, 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Caja x 3', 'SM-MAL-CAJ3',  690000,  20, 4000, 2),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Caja x 6', 'SM-MAL-CAJ6', 1320000,  10, 7800, 3),
  -- Cabernet Franc
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000002', '750 ml',   'SM-CAB-750',   250000,  50, 1250, 1),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000002', 'Caja x 3', 'SM-CAB-CAJ3',  690000,  20, 4000, 2),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000002', 'Caja x 6', 'SM-CAB-CAJ6', 1320000,  10, 7800, 3);

-- ─────────────────────────────────────────
-- MÉTODOS DE ENVÍO (placeholder — ajustar tarifas reales en admin)
-- ─────────────────────────────────────────

insert into public.shipping_methods (id, name, type, is_active, zones, position) values
  (
    '00000000-0000-0000-0003-000000000001',
    'Envío a domicilio — Buenos Aires',
    'delivery',
    true,
    '[{
      "type": "provinces",
      "values": ["Buenos Aires", "Ciudad Autónoma de Buenos Aires"],
      "base_rate_cents": 350000,
      "per_kg_cents": 0,
      "free_from_cents": 1500000
    }]'::jsonb,
    1
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    'Envío a domicilio — Interior',
    'delivery',
    true,
    '[{
      "type": "provinces",
      "values": ["Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Rosario", "Entre Ríos",
                 "Neuquén", "Río Negro", "Chubut", "Santa Cruz", "Tierra del Fuego",
                 "Salta", "Jujuy", "Catamarca", "La Rioja", "Santiago del Estero",
                 "Chaco", "Formosa", "Misiones", "Corrientes", "San Luis",
                 "La Pampa", "San Juan"],
      "base_rate_cents": 600000,
      "per_kg_cents": 0,
      "free_from_cents": 2500000
    }]'::jsonb,
    2
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    'Retiro en teatro (CABA)',
    'theater_pickup',
    true,
    '[]'::jsonb,
    3
  );

-- ─────────────────────────────────────────
-- BLOQUES DE CONTENIDO (placeholder)
-- ─────────────────────────────────────────

insert into public.content_blocks (key, type, value) values
  ('hero_title',      'text',       '{"text": "Como el vino, Soy Mestiza"}'),
  ('hero_subtitle',   'text',       '{"text": "Un vino de altura del Valle de Calingasta, San Juan. Nacido de la tierra y del escenario."}'),
  ('about_title',     'text',       '{"text": "La obra"}'),
  ('about_text',      'rich_text',  '{"html": "<p>Soy Mestiza nació en el escenario. Un vino pensado para quienes valoran la tierra, la identidad y el encuentro.</p>"}'),
  ('legal_notice',    'text',       '{"text": "Beber con moderación. Prohibida su venta a menores de 18 años. Ley 24.788."}');
