# Soy Mestiza — Ecommerce

Ecommerce de la marca de vinos Soy Mestiza. Next.js 16 + Supabase + Mercado Pago.  
Desarrollado por [Alora](https://globalalora.com).

## Setup local

### Requisitos

- Node.js ≥22
- pnpm ≥9
- [Supabase CLI](https://supabase.com/docs/guides/cli) (para Fase 2+)

### 1. Clonar y instalar

```bash
git clone https://github.com/GlobalAlora/mestiza.git
cd mestiza
pnpm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completar `.env.local` con los valores del proyecto de staging de Supabase y las credenciales de sandbox de Mercado Pago.

Variables obligatorias para levantar:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Base de datos local (Fase 2+)

```bash
pnpm supabase start          # levanta Postgres + Studio local
pnpm supabase db reset       # aplica migraciones + seed
```

Studio disponible en http://localhost:54323.

### 4. Levantar el servidor

```bash
pnpm dev
```

El sitio queda disponible en http://localhost:3000.

---

## Scripts

| Comando             | Descripción                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo                    |
| `pnpm build`        | Build de producción                       |
| `pnpm start`        | Servidor de producción (después de build) |
| `pnpm lint`         | ESLint                                    |
| `pnpm typecheck`    | TypeScript sin emitir                     |
| `pnpm format`       | Prettier (escribe)                        |
| `pnpm format:check` | Prettier (solo verifica)                  |

## Convenciones

Ver [CLAUDE.md](./CLAUDE.md) para convenciones detalladas de código, arquitectura y reglas de seguridad.

## Deploy

**Staging** (rama `develop` + Vercel Previews) → proyecto Supabase `mestiza-staging`.  
**Producción** (rama `main`) → proyecto Supabase `mestiza-prod`.

Ver [docs/INFRA.md](./docs/INFRA.md) para detalles de infraestructura.

## Ramas

```
main       ← producción (protegida, sin push directo)
develop    ← staging
feat/*     ← features en desarrollo
```
