# Soy Mestiza — Convenciones del Proyecto

## Stack

| Herramienta  | Versión | Notas                                       |
| ------------ | ------- | ------------------------------------------- |
| Next.js      | 16.3.5  | App Router, TypeScript strict               |
| React        | 19.3.0  |                                             |
| Tailwind CSS | 4.3.3   | Config en `src/styles/tokens.css`           |
| Supabase     | 2.116.0 | Postgres + Auth + Storage                   |
| Zod          | 4.6.5   | Validación de forms, actions, webhooks, env |
| pnpm         | ≥9      | Package manager                             |

## Comandos

```bash
pnpm dev                          # servidor de desarrollo
pnpm build                        # build de producción
pnpm typecheck                    # tsc --noEmit (sin emitir)
pnpm lint                         # ESLint
pnpm format                       # Prettier (escribe)
pnpm format:check                 # Prettier (solo verifica, CI)

pnpm supabase start               # Supabase local
pnpm supabase stop
pnpm supabase db reset            # aplica migraciones + seed (local)
pnpm supabase db push             # aplica migraciones en remoto

# Regenerar tipos después de cambios en el schema:
pnpm supabase gen types typescript --local > src/lib/supabase/types.ts
```

## Reglas críticas de seguridad

- `SUPABASE_SERVICE_ROLE_KEY` solo en servidor. Jamás en `NEXT_PUBLIC_*` ni en Client Components.
- Nunca confiar en precios del cliente. El total se recalcula SIEMPRE en servidor (Server Action) usando datos de la DB.
- Los pedidos se crean solo desde Server Actions con `createAdminClient()` — no hay política INSERT en `orders` para `anon` ni `authenticated`.
- `orders.access_token` (random, no adivinable) para URLs de confirmación y acceso del invitado. Nunca exponer `orders.id` ni `orders.order_number` en URLs públicas.
- Webhooks verificados por firma (`x-signature` de Mercado Pago). Nunca procesar un webhook sin verificar.

## Arquitectura general

- **Server Components** por defecto. `"use client"` solo donde hay interactividad real.
- **Mutaciones** vía Server Actions validadas con Zod. Nunca fetch manual a API routes para mutaciones.
- **Queries** en `features/*/queries/`. Nunca SQL suelto en componentes.
- **`lib/env.ts`** es la única fuente de env vars en server-side code.
- **`lib/supabase/client.ts`** usa `process.env.NEXT_PUBLIC_*` directamente (no importar `env.ts` en Client Components).

## Convenciones de código

- Código en inglés, contenido de UI en `src/i18n/es-AR.ts`.
- Sin `any`, sin `@ts-ignore`. TypeScript strict mode.
- Sin dependencias extra sin justificación documentada en PR.
- Nombres descriptivos, funciones cortas. Sin código muerto ni comentarios obvios.
- Precios en centavos (integer). `250000` = ARS 2.500.
- Slugs inmutables una vez que `status = 'published'`.

## Routing

- Proxy en `src/proxy.ts` (renombrado de `middleware.ts` en Next.js 16).
- Admin: `/admin/*` — protección en `proxy.ts` (cookie check ligero) + `app/admin/layout.tsx` (auth check completo via Supabase).
- Rutas públicas: `/tienda`, `/tienda/[category]`, `/producto/[slug]`, `/historia`, `/contacto`.
- Cuenta: `/mi-cuenta`, `/mi-cuenta/pedidos`, `/mi-cuenta/pedidos/[id]`.

## Clientes Supabase

| Archivo                  | Key          | Cuándo usar                                                   |
| ------------------------ | ------------ | ------------------------------------------------------------- |
| `lib/supabase/server.ts` | anon         | Server Components, Server Actions (lectura, auth del usuario) |
| `lib/supabase/client.ts` | anon         | Client Components                                             |
| `lib/supabase/admin.ts`  | service_role | Webhooks, crear pedidos, admin panel mutations                |

## Tailwind v4

- Tokens en `src/styles/tokens.css` — único archivo para cambios de branding.
- `@theme` genera utilidades: `--color-primary` → `bg-primary`, `text-primary`, `border-primary`.
- No hay `tailwind.config.ts`. Config por CSS.
- PostCSS: `@tailwindcss/postcss` (no `autoprefixer` separado, está incluido).

## Rate limiting (Fase 4)

**Upstash Ratelimit** (`@upstash/ratelimit` + `@upstash/redis`).

- No in-memory: serverless no garantiza estado compartido entre instancias.
- Free tier de Upstash: 10,000 comandos/día.
- Dos env vars: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.

## Emails transaccionales (Fase 4)

Resend + React Email. 6 templates en `lib/email/`:

1. Pedido recibido (cliente)
2. Nuevo pedido (admin)
3. Pago aprobado
4. En preparación
5. Enviado / Listo para retirar
6. Entregado

## Notas de Next.js 16

- `middleware.ts` fue renombrado a `proxy.ts`. Exportar función `proxy` (named) o default.
- `cookies()` es async: `const cookieStore = await cookies()`.
- `headers()` es async: `const headersList = await headers()`.
- `typedRoutes: true` en `next.config.ts` — usar `href` tipados donde sea posible.

## Supabase — dos proyectos

- `mestiza-staging`: Vercel Preview deployments + desarrollo local.
- `mestiza-prod`: rama `main` en producción.
- Cron diario (`/api/cron/ping-db`) evita la pausa por inactividad del Free tier.

## Fases del proyecto

- [x] Fase 0 — Plan
- [x] Fase 1 — Fundaciones
- [x] Fase 2 — Datos (migraciones, RLS, seed)
- [ ] Fase 3 — Catálogo público + SEO
- [ ] Fase 4 — Carrito y checkout
- [ ] Fase 5 — Admin
- [ ] Fase 6 — Cuenta, QA y hardening
