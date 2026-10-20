-- Actualización de productos con fichas técnicas reales (Oct 2026)
-- Reemplaza placeholders por datos reales extraídos de fichas-1.pdf

-- ─── Producto 1: Moscatel Dulce Natural (era "Malbec" placeholder) ─────────

update public.products set
  name        = 'Soy Mestiza Dulce Natural',
  slug        = 'soy-mestiza-dulce-natural',
  description = 'Moscatel Dulce Natural del Valle de Calingasta, San Juan. Color amarillo pálido con reflejos verdosos y destellos dorados. En nariz, aromas florales y frutales: uva fresca, durazno blanco, pera y matices cítricos, con recuerdos de azahar y jazmín. En boca, entrada dulce y amable con una sensación fresca que acompaña su expresión frutal. Final aromático y delicado, con persistencia frutal y recuerdo de flores blancas.',
  attributes  = '{
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
  is_placeholder = false
where id = '00000000-0000-0000-0001-000000000001';

-- ─── Producto 2: Cabernet Malbec (era "Cabernet Franc" placeholder) ─────────

update public.products set
  name        = 'Soy Mestiza Cabernet Malbec',
  slug        = 'soy-mestiza-cabernet-malbec',
  description = 'Cabernet Sauvignon - Malbec del Valle de Calingasta, San Juan. 8 meses de crianza en roble francés. Color rojo rubí profundo con matices violetas y destellos granate. En nariz, alta intensidad: cassis, moras y arándanos, matices pirazínicos de pimiento y pimienta negra, tomillo y jarilla autóctona, con dejos sutiles de vainilla, cacao y tabaco rubio aportados por el roble. En boca ingresa con fluidez y acidez viva. Taninos firmes con textura tiza/grava, característica mineral de la altura de Calingasta. Final largo y elegante con retrogusto de frutos secos tostados y chocolate amargo.',
  attributes  = '{
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
  is_placeholder = false
where id = '00000000-0000-0000-0001-000000000002';

-- ─── Variantes: actualizar SKUs ──────────────────────────────────────────────

update public.product_variants set sku = 'SM-DUL-750'  where sku = 'SM-MAL-750';
update public.product_variants set sku = 'SM-DUL-CAJ3' where sku = 'SM-MAL-CAJ3';
update public.product_variants set sku = 'SM-DUL-CAJ6' where sku = 'SM-MAL-CAJ6';

-- ─── Contenido: hero y about con texto real de marca ────────────────────────

update public.content_blocks set value = '{"text": "Donde el arte, la tierra y el vino se encuentran"}'
where key = 'hero_title';

update public.content_blocks set value = '{"text": "Dos vinos, dos emociones. Una misma esencia. Desde el Valle de Calingasta, San Juan."}'
where key = 'hero_subtitle';

update public.content_blocks set value = '{"text": "Soy Mestiza"}'
where key = 'about_title';

update public.content_blocks set
  value = '{"html": "<p>Soy Mestiza nace del universo creativo de Mariana Clemensó y de una manera de sentir la vida: como una fusión de raíces, culturas, caminos y emociones.</p><p>Soy Mestiza es encuentro. Es memoria y presente. Es aquello que llevamos de quienes estuvieron antes y lo nuevo que nace cuando distintas historias se abrazan.</p><p>Y esa misma esencia que Mariana llevó al escenario a través de la música, la danza y la emoción, hoy encuentra una nueva forma de expresarse: el vino.</p><p>Desde San Juan, tierra de sol, montaña y tradición vitivinícola, nace Soy Mestiza, una colección de vinos que busca despertar los sentidos y convertir cada copa en una experiencia.</p><p>Porque detrás de cada botella hay una tierra que habla, una historia que contar y una emoción esperando ser descubierta.</p>"}'
where key = 'about_text';
