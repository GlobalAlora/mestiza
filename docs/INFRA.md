# Infraestructura — Soy Mestiza

## Servicios

| Servicio     | Plan                                   | URL                            |
| ------------ | -------------------------------------- | ------------------------------ |
| Vercel       | Hobby (staging) / **Pro** (producción) | vercel.com                     |
| Supabase     | Free                                   | supabase.com                   |
| Mercado Pago | Standard                               | developers.mercadopago.com     |
| Resend       | Free                                   | resend.com                     |
| Upstash      | Free                                   | console.upstash.com            |
| GitHub       | Free                                   | github.com/GlobalAlora/mestiza |

---

## Vercel

### Diferencia Hobby vs Pro

**Hobby** es para uso **no comercial**. Un ecommerce en producción requiere Vercel **Pro**.

- **Staging**: puede usarse en Hobby (previews y testing).
- **Producción**: **debe migrar a Pro** antes del lanzamiento.

### Límites actuales de Vercel Hobby (verificados septiembre 2026)

| Recurso                             | Límite              |
| ----------------------------------- | ------------------- |
| Deployments / día                   | 100                 |
| Build time / deployment             | 45 minutos          |
| Vercel Functions — duración default | 10s                 |
| Vercel Functions — duración máxima  | 60s (1 minuto)      |
| Static file uploads (deploy)        | 100 MB              |
| Runtime logs                        | 1 hora de retención |
| Cron Jobs (mínimo intervalo)        | 1 vez por día       |
| Cron Jobs (precisión)               | Por hora (±59 min)  |
| Concurrent deployments              | 1                   |

### Límites Vercel Pro (para planificar la migración)

| Recurso                            | Límite             |
| ---------------------------------- | ------------------ |
| Deployments / día                  | 6000               |
| Vercel Functions — duración máxima | 300s (5 minutos)   |
| Static file uploads (deploy)       | 1 GB               |
| Runtime logs                       | 1 día de retención |
| Cron Jobs (mínimo intervalo)       | 1 vez por minuto   |
| Concurrent deployments             | hasta 500          |

### Señales para migrar Hobby → Pro

- Tráfico real de ventas (Hobby es no comercial).
- Una función supera los 60s de ejecución (webhooks de MP con carga alta).
- Necesitás más de 1 deployment por día desde la misma cuenta.
- Runtime logs de 1h no alcanzan para debuggear errores en producción.

---

## Supabase

### Dos proyectos

| Proyecto          | Uso                                | Variables en                        |
| ----------------- | ---------------------------------- | ----------------------------------- |
| `mestiza-staging` | Vercel Previews + desarrollo local | `.env.local` + Vercel `preview` env |
| `mestiza-prod`    | Producción (rama `main`)           | Vercel `production` env             |

### Límites del Free tier (verificar en supabase.com/pricing)

- **Pausa por inactividad**: el proyecto se pausa tras 7 días sin actividad HTTP. Mitigación: cron diario en `/api/cron/ping-db` (via Vercel Cron, una vez al día).
- **Egress**: 5 GB/mes. Las imágenes de productos se optimizan al subir (WebP/AVIF) y se sirven via `next/image` con `sizes` correctos para minimizar egress.
- **Almacenamiento**: 500 MB en Free. Optimizar imágenes antes de subir a Supabase Storage.
- **Conexiones simultáneas**: 60 conexiones directas + 200 via Supavisor en Free.
- **Sin transformación de imágenes en edge**: procesar y redimensionar antes de subir.

### Señales para migrar a Supabase Pro

- Egress supera 3 GB/mes (margen de seguridad).
- Almacenamiento supera 400 MB.
- Errores de "too many connections" en logs.
- Se necesita transformación de imágenes en edge (plan Pro incluye Imgproxy).

---

## Dominio

Dominio pendiente de definición: `soymestiza.com` vs `universosoymestiza.com`.

- Configurar el `.com` como dominio principal.
- Agregar redirect 301 desde `.com.ar` → `.com`.
- **Nunca hardcodear el dominio**: todo sale de `NEXT_PUBLIC_SITE_URL`.

---

## Envío de alcohol por correo (R2)

**Restricción importante**: no todos los transportistas aceptan bebidas alcohólicas.

- **Correo Argentino**: generalmente no acepta alcohol.
- **Andreani/OCA**: aceptan con declaración de contenido, sujeto a destino.
- **En v1**: la capa de envío es manual (tarifa fija por zona). No hay integración con transportistas.
- **Antes de integrar Andreani/OCA**: verificar condiciones de servicio y restricciones por provincia.
- **Posibles restricciones**: algunas provincias pueden tener regulaciones adicionales para recepción de bebidas alcohólicas.

---

## Variables de entorno por ambiente

Ver `.env.example` para la lista completa.

| Variable                    | Development      | Staging (Vercel Preview) | Producción       |
| --------------------------- | ---------------- | ------------------------ | ---------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | proyecto staging | proyecto staging         | proyecto prod    |
| `SUPABASE_SERVICE_ROLE_KEY` | proyecto staging | proyecto staging         | proyecto prod    |
| `MERCADOPAGO_ACCESS_TOKEN`  | TEST credentials | TEST credentials         | PROD credentials |
| `VERCEL_ENV`                | no aplica        | `preview`                | `production`     |
