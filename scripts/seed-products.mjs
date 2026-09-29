/**
 * Seed script — inserts ~100 test products into Supabase.
 * Run: node scripts/seed-products.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

// Parse .env.local manually (no dotenv dependency needed)
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'],
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function slug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Vinos Tintos', slug: 'vinos-tintos', description: 'Tintos de altura de Calingasta', position: 1 },
  { name: 'Vinos Blancos', slug: 'vinos-blancos', description: 'Blancos frescos y aromáticos', position: 2 },
  { name: 'Vinos Rosados', slug: 'vinos-rosados', description: 'Rosados de corte floral', position: 3 },
  { name: 'Espumantes', slug: 'espumantes', description: 'Espumantes de método tradicional', position: 4 },
  { name: 'Cajas', slug: 'cajas', description: 'Cajas regalo y sets especiales', position: 5 },
];

// ── Products catalog ──────────────────────────────────────────────────────────

const TINTOS = [
  { name: 'Soy Mestiza Malbec', grape: 'Malbec', year: 2023, price: 250000, compare: null, desc: 'Malbec de altura con notas de ciruela negra, violetas y especias. Taninos sedosos y final prolongado.' },
  { name: 'Soy Mestiza Malbec Reserva', grape: 'Malbec', year: 2022, price: 380000, compare: null, desc: 'Reserva 12 meses en roble francés. Concentración y elegancia de la Precordillera de Calingasta.' },
  { name: 'Soy Mestiza Malbec Gran Reserva', grape: 'Malbec', year: 2021, price: 580000, compare: null, desc: 'Cima de la colección. 18 meses en barrica nueva. Expresión máxima del terroir de altura.' },
  { name: 'Soy Mestiza Cabernet Franc', grape: 'Cabernet Franc', year: 2023, price: 270000, compare: null, desc: 'Pimiento, tabaco y frutos rojos. Cuerpo medio con acidez vibrante. Calingasta en estado puro.' },
  { name: 'Soy Mestiza Cabernet Franc Reserva', grape: 'Cabernet Franc', year: 2022, price: 420000, compare: null, desc: 'Reserva 10 meses en roble. La cepa emblemática de Mestiza en su versión más compleja.' },
  { name: 'Soy Mestiza Cabernet Sauvignon', grape: 'Cabernet Sauvignon', year: 2023, price: 260000, compare: null, desc: 'Cassis, cedro y grafito. Estructura potente y taninos firmes que invitan a la guarda.' },
  { name: 'Soy Mestiza Syrah', grape: 'Syrah', year: 2023, price: 265000, compare: null, desc: 'Pimienta negra, mora y cuero. La frescura de la altitud domina este Syrah de carácter único.' },
  { name: 'Soy Mestiza Syrah Reserva', grape: 'Syrah', year: 2022, price: 390000, compare: null, desc: 'Syrah con 12 meses de crianza. Profundo, especiado y con un postgusto mineral inconfundible.' },
  { name: 'Soy Mestiza Merlot', grape: 'Merlot', year: 2023, price: 245000, compare: null, desc: 'Ciruela madura, chocolate y toques florales. Un tinto accesible y expresivo de gran placer.' },
  { name: 'Soy Mestiza Tempranillo', grape: 'Tempranillo', year: 2023, price: 255000, compare: null, desc: 'Frutos rojos, cuero y vainilla. Raíces flamencas en un vino de personalidad y alma española.' },
  { name: 'Soy Mestiza Blend Flamenco', grape: 'Malbec / Cabernet Franc', year: 2023, price: 320000, compare: null, desc: 'El corte emblema de la bodega. Fusión de Malbec y Cabernet Franc inspirada en el flamenco.' },
  { name: 'Soy Mestiza Blend Árabe', grape: 'Malbec / Syrah', year: 2023, price: 330000, compare: null, desc: 'Especiado y exuberante. Homenaje a las raíces árabes de la obra que inspira esta colección.' },
  { name: 'Soy Mestiza Blend Folclore', grape: 'Cabernet / Merlot / Syrah', year: 2022, price: 360000, compare: null, desc: 'Tres cepas, una identidad. Blend de guarda con estructura y elegancia de terroir andino.' },
  { name: 'Soy Mestiza Tango', grape: 'Malbec / Tempranillo', year: 2023, price: 310000, compare: null, desc: 'Pasión y elegancia en cada sorbo. Corte argentino-español para los amantes del buen vino.' },
  { name: 'Soy Mestiza Pinot Noir', grape: 'Pinot Noir', year: 2023, price: 350000, compare: null, desc: 'Sutileza y complejidad de la Precordillera. Frutos rojos finos, terroso y de larga permanencia.' },
  { name: 'Soy Mestiza Malbec 2020', grape: 'Malbec', year: 2020, price: 450000, compare: null, desc: 'Cosecha excepcional. Cinco años de guarda revelan la madurez y la personalidad de Calingasta.' },
  { name: 'Soy Mestiza Cabernet Sauvignon Reserva', grape: 'Cabernet Sauvignon', year: 2021, price: 480000, compare: null, desc: 'Reserva especial 14 meses en roble americano y francés. Para grandes ocasiones.' },
  { name: 'Soy Mestiza Bonarda', grape: 'Bonarda', year: 2023, price: 235000, compare: null, desc: 'Fresca y frutal, con notas de mora y violetas. Una cepa argentina en su mejor versión de altura.' },
  { name: 'Soy Mestiza Malbec Orgánico', grape: 'Malbec', year: 2023, price: 295000, compare: null, desc: 'Sin herbicidas ni pesticidas. Pureza del terroir Calingasta en cada botella con certificación orgánica.' },
  { name: 'Soy Mestiza Petit Verdot', grape: 'Petit Verdot', year: 2022, price: 370000, compare: null, desc: 'Oscuro e intenso. Mora negra, violeta y pimienta. Taninos potentes de larga guarda.' },
  { name: 'Soy Mestiza Gran Corte', grape: 'Malbec / Cab. Franc / Petit Verdot', year: 2021, price: 650000, compare: null, desc: 'La etiqueta premium de Soy Mestiza. Ensamblaje bordelés adaptado al terroir andino de altura.' },
  { name: 'Soy Mestiza Malbec Single Vineyard', grape: 'Malbec', year: 2022, price: 520000, compare: null, desc: 'Parcela seleccionada. Expresión de un único bloque de viñedo a 1.800 msnm.' },
  { name: 'Soy Mestiza Cabernet Franc Single Vineyard', grape: 'Cabernet Franc', year: 2022, price: 540000, compare: null, desc: 'De una sola parcela. Toda la verticalidad y la mineralidad del suelo de Calingasta.' },
  { name: 'Soy Mestiza Syrah Gran Reserva', grape: 'Syrah', year: 2020, price: 620000, compare: null, desc: 'Lo más alto de nuestra línea de Syrah. 20 meses en barrica. Complejidad y elegancia suprema.' },
  { name: 'Soy Mestiza Malbec Barrica Nueva', grape: 'Malbec', year: 2022, price: 430000, compare: null, desc: 'Crianza íntegra en madera nueva. Vainilla, cedro y frutos negros integrados con maestría.' },
  { name: 'Soy Mestiza Malbec Rosé Vinificado en Tinto', grape: 'Malbec', year: 2023, price: 240000, compare: null, desc: 'Maceración corta que extrae color y carácter. Un tinto ligero con alma de rosado.' },
  { name: 'Soy Mestiza Colección Flamenca Nº1', grape: 'Malbec', year: 2022, price: 480000, compare: null, desc: 'Primera edición limitada de la Colección Flamenca. Numerada y firmada por el winemaker.' },
  { name: 'Soy Mestiza Colección Flamenca Nº2', grape: 'Cabernet Franc', year: 2022, price: 490000, compare: null, desc: 'Segunda edición de la colección artística. Etiqueta con obra de arte original.' },
  { name: 'Soy Mestiza Edición Aniversario', grape: 'Malbec / Syrah', year: 2022, price: 750000, compare: null, desc: 'Edición especial por el aniversario de la obra. Solo 500 botellas. Numeradas y en estuche.' },
  { name: 'Soy Mestiza Malbec Joven', grape: 'Malbec', year: 2024, price: 195000, compare: null, desc: 'Sin paso por madera. Fresco, frutal y vibrante. Ideal para el día a día.' },
];

const BLANCOS = [
  { name: 'Soy Mestiza Torrontés', grape: 'Torrontés', year: 2024, price: 220000, compare: null, desc: 'El blanco aromático argentino por excelencia. Floral, fresco y con persistente aroma a jazmín.' },
  { name: 'Soy Mestiza Torrontés Reserva', grape: 'Torrontés', year: 2023, price: 310000, compare: null, desc: 'Fermentado a baja temperatura para preservar aromas. Un Torrontés de madurez y complejidad.' },
  { name: 'Soy Mestiza Chardonnay', grape: 'Chardonnay', year: 2024, price: 235000, compare: null, desc: 'Manzana verde, durazno y cítricos. La altitud aporta acidez y frescura únicas.' },
  { name: 'Soy Mestiza Chardonnay Fermentado en Roble', grape: 'Chardonnay', year: 2023, price: 360000, compare: null, desc: 'Fermentado y criado en barrica. Mantequilla, tostado y cítricos integrados. Gran armonía.' },
  { name: 'Soy Mestiza Sauvignon Blanc', grape: 'Sauvignon Blanc', year: 2024, price: 230000, compare: null, desc: 'Pomelo, hierba fresca y mineralidad. Acidez vivaz que invita a una segunda copa.' },
  { name: 'Soy Mestiza Viognier', grape: 'Viognier', year: 2024, price: 255000, compare: null, desc: 'Durazno, albaricoque y flores blancas. Untuoso y aromático. Un blanco de carácter propio.' },
  { name: 'Soy Mestiza Blend Blanco', grape: 'Torrontés / Chardonnay', year: 2024, price: 270000, compare: null, desc: 'Ensamblaje de dos blancos emblemáticos. Aromas florales con cuerpo y longitud en boca.' },
  { name: 'Soy Mestiza Roussanne', grape: 'Roussanne', year: 2023, price: 320000, compare: null, desc: 'Cepa del Ródano en los Andes. Cera de abeja, peras maduras y hierbas de montaña.' },
  { name: 'Soy Mestiza Torrontés Natural', grape: 'Torrontés', year: 2024, price: 280000, compare: null, desc: 'Mínima intervención. Sin filtraciones. La naturaleza del viñedo en estado puro.' },
  { name: 'Soy Mestiza Chardonnay Sin Madera', grape: 'Chardonnay', year: 2024, price: 225000, compare: null, desc: 'Puro fruto. Sin crianza en madera. Fresco, vivo y de perfecta acidez natural.' },
];

const ROSADOS = [
  { name: 'Soy Mestiza Rosé de Malbec', grape: 'Malbec', year: 2024, price: 215000, compare: null, desc: 'Sangría, frutillas y pétalos de rosa. Fresco y versátil. El rosado del verano andino.' },
  { name: 'Soy Mestiza Rosé de Cabernet Franc', grape: 'Cabernet Franc', year: 2024, price: 225000, compare: null, desc: 'Granada, frambuesa y especias suaves. Un rosado con estructura y personalidad propia.' },
  { name: 'Soy Mestiza Rosé Blend', grape: 'Malbec / Syrah', year: 2024, price: 240000, compare: null, desc: 'Corte de dos tintos que se complementan. Rosa salmón y complejidad frutal de altura.' },
  { name: 'Soy Mestiza Rosé de Pinot Noir', grape: 'Pinot Noir', year: 2024, price: 260000, compare: null, desc: 'Sutileza y elegancia en rosado. La fineza de la Pinot en su versión más fresca y viva.' },
  { name: 'Soy Mestiza Rosé Gran Reserva', grape: 'Malbec', year: 2023, price: 330000, compare: null, desc: 'Rosado con 6 meses en barrica. Complejidad y profundidad inusuales. Un rosado para guardar.' },
];

const ESPUMANTES = [
  { name: 'Soy Mestiza Brut Nature', grape: 'Chardonnay / Pinot Noir', year: 2022, price: 420000, compare: null, desc: 'Sin adición de azúcar. Método tradicional. Pan brioche, cítricos y persistente burbuja fina.' },
  { name: 'Soy Mestiza Extra Brut', grape: 'Chardonnay', year: 2022, price: 390000, compare: null, desc: 'Refrescante y preciso. 18 meses en rima. Ideal como aperitivo o acompañamiento de mariscos.' },
  { name: 'Soy Mestiza Brut Rosé', grape: 'Malbec', year: 2023, price: 410000, compare: null, desc: 'Espumante rosado de carácter festivo. Frutillas, frambuesas y burbuja cremosa.' },
  { name: 'Soy Mestiza Demi-Sec', grape: 'Torrontés / Chardonnay', year: 2023, price: 370000, compare: null, desc: 'Levemente dulce y floral. Para momentos de celebración con postres o quesos azules.' },
  { name: 'Soy Mestiza Blanc de Blancs', grape: 'Chardonnay', year: 2021, price: 520000, compare: null, desc: 'Solo Chardonnay. 36 meses en rima. La cima de nuestra línea de espumantes de alta gama.' },
];

const CAJAS = [
  { name: 'Caja Dúo Malbec', grape: null, year: null, price: 520000, compare: null, desc: 'Dos botellas de Soy Mestiza Malbec 2023 en estuche de madera artesanal. Regalo perfecto.' },
  { name: 'Caja Trío Mestiza', grape: null, year: null, price: 780000, compare: null, desc: 'Malbec + Cabernet Franc + Blend Flamenco. La presentación esencial de Soy Mestiza.' },
  { name: 'Caja Selección Tintos', grape: null, year: null, price: 950000, compare: null, desc: '6 botellas de la línea de tintos. Ideal para explorar la gama completa del terroir andino.' },
  { name: 'Caja Premium Reservas', grape: null, year: null, price: 1400000, compare: null, desc: 'Malbec Reserva + Cabernet Franc Reserva + Syrah Reserva + Gran Corte. Para el coleccionista.' },
  { name: 'Caja Aniversario', grape: null, year: null, price: 1200000, compare: null, desc: 'Edición especial para celebrar. Incluye 3 tintos, 1 blanco y 1 espumante en estuche de lujo.' },
  { name: 'Set Degustación Blancos', grape: null, year: null, price: 650000, compare: null, desc: 'Torrontés + Chardonnay + Sauvignon Blanc + Viognier. El descubrimiento de los blancos andinos.' },
  { name: 'Caja Rosé & Espumante', grape: null, year: null, price: 730000, compare: null, desc: 'Brut Rosé + Rosé de Malbec + Rosé de Cabernet Franc. Para los momentos de fiesta.' },
  { name: 'Caja Regalo Navidad', grape: null, year: null, price: 890000, compare: null, desc: 'Malbec + Blend Flamenco + Brut Nature en caja navideña edición limitada con accesorios.' },
  { name: 'Caja Maridaje Asado', grape: null, year: null, price: 720000, compare: null, desc: 'Selección ideal para acompañar un asado argentino: 2 Malbec + 1 Cabernet + 1 Syrah.' },
  { name: 'Membresía Mestiza Club × 3', grape: null, year: null, price: 680000, compare: null, desc: 'Suscripción trimestral: 3 botellas curadas cada mes. Descubrir el mundo Mestiza todo el año.' },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔌 Conectando a Supabase...\n');

  // 1. Upsert categories
  console.log('📂 Upserting categorías...');
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select('id, slug, name');

  if (catErr) { console.error('❌ Error en categorías:', catErr.message); process.exit(1); }
  console.log(`   ✓ ${cats.length} categorías OK\n`);

  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // Also preserve existing Vinos category
  const { data: existingCats } = await supabase.from('categories').select('id, slug');
  for (const c of existingCats ?? []) { catMap[c.slug] = c.id; }

  // 2. Collect all product definitions
  const allProducts = [
    ...TINTOS.map((p) => ({ ...p, catSlug: 'vinos-tintos' })),
    ...BLANCOS.map((p) => ({ ...p, catSlug: 'vinos-blancos' })),
    ...ROSADOS.map((p) => ({ ...p, catSlug: 'vinos-rosados' })),
    ...ESPUMANTES.map((p) => ({ ...p, catSlug: 'espumantes' })),
    ...CAJAS.map((p) => ({ ...p, catSlug: 'cajas' })),
  ];

  console.log(`📦 Insertando ${allProducts.length} productos...`);

  let ok = 0, skip = 0;

  for (const p of allProducts) {
    const productSlug = slug(p.name) + (p.year ? `-${p.year}` : '');
    const attrs = {};
    if (p.grape) attrs.grape = p.grape;
    if (p.year) attrs.year = p.year;

    // Upsert product
    const { data: prod, error: prodErr } = await supabase
      .from('products')
      .upsert({
        name: p.name,
        slug: productSlug,
        description: p.desc,
        category_id: catMap[p.catSlug] ?? null,
        attributes: attrs,
        status: 'published',
        is_placeholder: false,
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (prodErr) {
      console.warn(`   ⚠ Skip "${p.name}": ${prodErr.message}`);
      skip++;
      continue;
    }

    // Upsert variant
    const variantName = p.year ? `Botella 750ml · ${p.year}` : 'Botella 750ml';
    const sku = productSlug.toUpperCase().replace(/-/g, '_').slice(0, 40);

    await supabase.from('product_variants').upsert({
      product_id: prod.id,
      name: variantName,
      sku,
      price_cents: p.price,
      compare_at_price_cents: p.compare,
      stock: Math.floor(Math.random() * 80) + 20, // 20–100 units
      position: 0,
    }, { onConflict: 'sku' });

    ok++;
    process.stdout.write(`\r   ✓ ${ok} productos insertados...`);
  }

  console.log(`\n\n✅ Seed completo: ${ok} productos OK, ${skip} skipped\n`);

  // 3. Summary
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  console.log(`📊 Total productos publicados en DB: ${count}`);

  const { data: catCounts } = await supabase.from('products').select('category_id, categories(name)').eq('status', 'published');
  const summary = {};
  for (const r of catCounts ?? []) {
    const name = r.categories?.name ?? 'Sin categoría';
    summary[name] = (summary[name] ?? 0) + 1;
  }
  console.log('   Por categoría:');
  for (const [cat, n] of Object.entries(summary)) console.log(`   · ${cat}: ${n}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
