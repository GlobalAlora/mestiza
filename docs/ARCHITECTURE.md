# Arquitectura — Soy Mestiza

## Stack

```
Browser
  └── Next.js 16 (App Router, React 19, TypeScript strict)
       ├── Tailwind CSS v4 (design tokens en src/styles/tokens.css)
       ├── Zustand (carrito, client-side state)
       └── @supabase/ssr (auth cookies)

Server
  ├── Supabase Postgres (datos: productos, pedidos, usuarios)
  ├── Supabase Auth (JWT, sesiones)
  ├── Supabase Storage (imágenes de productos)
  ├── Mercado Pago Checkout Pro (pagos — redirect, sin datos de tarjeta)
  └── Resend + React Email (emails transaccionales)

Infra
  ├── Vercel (deploy, CDN, Cron Jobs, Edge Functions)
  └── Upstash Redis (rate limiting serverless)
```

## Estructura de carpetas

```
src/
  app/
    (store)/            # Rutas públicas: /, /tienda, /producto/[slug], etc.
    (account)/          # Cuenta del cliente: /mi-cuenta, /mi-cuenta/pedidos
    admin/              # Panel de administración (protegido por rol)
    api/
      webhooks/mercadopago/  # Webhook de pago con validación x-signature
      cron/ping-db/          # Keep-alive para Supabase Free tier
    layout.tsx          # Root layout (fonts, metadata base, age gate)
    opengraph-image.tsx # OG image site-wide (ISR)
    not-found.tsx
    error.tsx

  features/             # Organizado por dominio de negocio
    catalog/            # Productos, categorías, variantes
    cart/               # Estado del carrito (Zustand + localStorage)
    checkout/           # Flujo de compra multi-paso
    orders/             # Pedidos y estados
    payments/           # Mercado Pago, webhooks
    shipping/           # Métodos de envío/retiro
    content/            # content_blocks editables (Home, Historia)
    auth/               # Autenticación, perfiles, roles

  components/
    ui/                 # Primitivos reutilizables (Button, Input, Modal, etc.)
    layout/             # Header, Footer, AgeGate

  lib/
    supabase/           # server.ts (anon), client.ts (browser), admin.ts (service_role), types.ts
    seo/                # metadata.ts, jsonld.ts
    email/              # resend.ts, templates
    env.ts              # Zod validation de env vars
    utils.ts            # cn(), formatPrice(), formatDate(), slugify()

  config/               # site.ts (metadata, legal), navigation.ts
  styles/               # tokens.css (@theme), globals.css
  i18n/                 # es-AR.ts (strings de UI)

supabase/
  migrations/           # Versionadas con Supabase CLI
  seed.sql

docs/
  ARCHITECTURE.md (este archivo)
  INFRA.md
  ADMIN_GUIDE.md
```

## Flujo de compra

```
Tienda → Ficha de producto → Carrito (localStorage/Zustand)
  → Checkout (Server Action valida carrito, recalcula total desde DB)
  → Crear pedido (service_role, orders.access_token generado)
  → Redirect a Mercado Pago Checkout Pro
  → Webhook /api/webhooks/mercadopago (valida firma, idempotencia)
  → Al aprobar: decrement_stock() transaccional + cambio de estado
  → Email al cliente + Email al admin
  → /pedido/[access_token]/confirmacion
```

## Modelo de datos (resumen)

Ver migraciones en `supabase/migrations/` para el schema completo.

Tablas principales:

- `categories` — árbol de categorías (slug, is_active, requires_age_verification)
- `products` — productos (slug inmutable post-publicación, attributes JSONB)
- `product_variants` — SKUs con precio en centavos, stock, opciones JSONB
- `product_images` — imágenes en Supabase Storage con alt obligatorio
- `profiles` — vinculado a auth.users, rol customer|admin
- `orders` — pedido con snapshot de datos (number, access_token, totales, estado)
- `order_items` — snapshot de nombre/sku/precio al momento de compra
- `order_status_history` — historial de cambios de estado
- `payments` — registro de pagos con payload raw de MP
- `shipping_methods` — métodos configurables (delivery/pickup/theater_pickup)
- `content_blocks` — contenido editable de Home e Historia

## Decisiones de diseño

**Carrito en cliente (Zustand + localStorage)**: Sin tabla en DB para v1. Rápido, sin auth necesaria. El servidor recalcula el total completo al iniciar checkout. Si se necesita cart abandonment o multi-device sync, migrar a DB.

**Rate limiting via Upstash**: No in-memory porque serverless (Vercel) no garantiza estado compartido entre instancias. Upstash usa HTTP + Redis atómico. Free tier: 10,000 comandos/día.

**Age gate client-side**: No middleware redirect para no romper SEO/AEO/GEO (Googlebot y crawlers de IA ven el HTML completo). La ley se cumple con el checkbox en checkout (`orders.age_verified`). Cookie de 30 días para la UX.

**OG images con opengraph-image.tsx**: Generadas estáticamente (ISR, cacheadas en Vercel CDN). Sin costo de función en runtime. Suficiente para v1.

**Sin next-intl en v1**: i18n "preparado" via `src/i18n/es-AR.ts` (diccionario de strings). Rutas ya en español. next-intl se agrega cuando se active `en`.

**proxy.ts (no middleware.ts)**: Renombrado en Next.js 16. Mismo API, mismo export config.
