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
    'Soy Mestiza Dulce Natural',
    'soy-mestiza-dulce-natural',
    'Moscatel Dulce Natural del Valle de Calingasta, San Juan. Color amarillo pálido con reflejos verdosos y destellos dorados. En nariz, aromas florales y frutales: uva fresca, durazno blanco, pera y matices cítricos, con recuerdos de azahar y jazmín. En boca, entrada dulce y amable con una sensación fresca que acompaña su expresión frutal. Final aromático y delicado, con persistencia frutal y recuerdo de flores blancas.',
    '{
      "varietal": "Moscatel",
      "style": "Dulce Natural",
      "region": "Valle de Calingasta, San Juan, Argentina",
      "oak": "Sin madera",
      "visual": "Amarillo pálido con reflejos verdosos y destellos dorados. Límpido y brillante.",
      "nose": "Expresivo, fresco y perfumado. Uva fresca, durazno blanco, pera, matices cítricos. Azahar y jazmín.",
      "palate": "Entrada dulce y amable. Cuerpo ligero a medio. Equilibrio entre dulzura y acidez. Final aromático con recuerdo de flores blancas.",
      "pairing": "Postres frutales, tortas, quesos suaves, picadas dulces. Aperitivo.",
      "producer": "Soy Mestiza — Como el vino",
      "label_tagline": "La fusión. Mestiza en tu paladar despierta nuevos sentidos."
    }'::jsonb,
    'published',
    false
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Soy Mestiza Cabernet Malbec',
    'soy-mestiza-cabernet-malbec',
    'Cabernet Sauvignon - Malbec del Valle de Calingasta, San Juan. 8 meses de crianza en roble francés. Color rojo rubí profundo con matices violetas y destellos granate. En nariz, alta intensidad: cassis, moras y arándanos, matices pirazínicos de pimiento y pimienta negra, tomillo y jarilla autóctona, con dejos sutiles de vainilla, cacao y tabaco rubio aportados por el roble. En boca ingresa con fluidez y acidez viva. Taninos firmes con textura tiza/grava, característica mineral de la altura de Calingasta. Final largo y elegante con retrogusto de frutos secos tostados y chocolate amargo.',
    '{
      "varietal": "Cabernet Sauvignon - Malbec",
      "style": "Tinto seco",
      "region": "Valle de Calingasta, San Juan, Argentina",
      "oak": "8 meses en roble francés",
      "visual": "Rojo rubí profundo con matices violetas intensos y destellos granate. Lágrimas de caída lenta.",
      "nose": "Alta intensidad, fresco y mineral. Cassis, moras, arándanos, frutas rojas silvestres. Pimiento rojo asado, pimienta negra, tomillo, jarilla autóctona. Vainilla, cacao amargo, tabaco rubio, sutiles ahumados.",
      "palate": "Acidez viva y vertiginosa. Cuerpo medio a pleno. Taninos firmes, textura tiza/grava (sensación mineral). Evolución con jugosidad de fruta negra y especiado del Cabernet. Final largo y elegante, retrogusto de frutos secos tostados y chocolate amargo.",
      "pairing": "Carnes rojas al asador, cordero, pastas con salsa de carne, quesos duros y estacionados.",
      "producer": "Soy Mestiza — Como el vino",
      "label_tagline": "La fusión. Mestiza en tu paladar despierta nuevos sentidos."
    }'::jsonb,
    'published',
    false
  );

-- ─────────────────────────────────────────
-- VARIANTES (750ml + Caja x3 + Caja x6 por producto)
-- Precios placeholder — actualizar antes del lanzamiento
-- ─────────────────────────────────────────

insert into public.product_variants (id, product_id, name, sku, price_cents, stock, weight_grams, position) values
  -- Dulce Natural (Moscatel)
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '750 ml',   'SM-DUL-750',   250000,  50, 1250, 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Caja x 3', 'SM-DUL-CAJ3',  690000,  20, 4000, 2),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Caja x 6', 'SM-DUL-CAJ6', 1320000,  10, 7800, 3),
  -- Cabernet Malbec
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
    '[{"name": "AMBA / Buenos Aires", "base_rate_cents": 350000}]'::jsonb,
    1
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    'Envío a domicilio — Interior',
    'delivery',
    true,
    '[{"name": "Interior del país", "base_rate_cents": 600000}]'::jsonb,
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
  ('hero_title',      'text',       '{"text": "Donde el arte, la tierra y el vino se encuentran"}'),
  ('hero_subtitle',   'text',       '{"text": "Dos vinos, dos emociones. Una misma esencia. Desde el Valle de Calingasta, San Juan."}'),
  ('about_title',     'text',       '{"text": "Soy Mestiza"}'),
  ('about_text',      'rich_text',  '{"html": "<p>Soy Mestiza nace del universo creativo de Mariana Clemensó y de una manera de sentir la vida: como una fusión de raíces, culturas, caminos y emociones.</p><p>Soy Mestiza es encuentro. Es memoria y presente. Es aquello que llevamos de quienes estuvieron antes y lo nuevo que nace cuando distintas historias se abrazan.</p><p>Y esa misma esencia que Mariana llevó al escenario a través de la música, la danza y la emoción, hoy encuentra una nueva forma de expresarse: el vino.</p><p>Desde San Juan, tierra de sol, montaña y tradición vitivinícola, nace Soy Mestiza, una colección de vinos que busca despertar los sentidos y convertir cada copa en una experiencia.</p><p>Porque detrás de cada botella hay una tierra que habla, una historia que contar y una emoción esperando ser descubierta.</p>"}'),
  ('legal_notice',    'text',       '{"text": "Beber con moderación. Prohibida su venta a menores de 18 años. Ley 24.788."}');
