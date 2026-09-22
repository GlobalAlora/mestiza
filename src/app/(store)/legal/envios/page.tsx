import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: `Política de envíos | ${siteConfig.name}`,
  description: `Costos y tiempos de envío de ${siteConfig.name}.`,
  path: '/legal/envios',
  noIndex: true,
});

export default function EnviosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-primary mb-2 font-serif text-4xl">Política de envíos</h1>
      <p className="text-muted mb-12 text-xs">Última actualización: septiembre 2026</p>

      <div className="text-ink space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-base font-semibold">Opciones de envío</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted py-3 pr-6 text-left font-semibold tracking-wider uppercase">
                    Modalidad
                  </th>
                  <th className="text-muted py-3 pr-6 text-left font-semibold tracking-wider uppercase">
                    Destino
                  </th>
                  <th className="text-muted py-3 pr-6 text-left font-semibold tracking-wider uppercase">
                    Tiempo estimado
                  </th>
                  <th className="text-muted py-3 text-left font-semibold tracking-wider uppercase">
                    Costo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <tr>
                  <td className="py-3 pr-6">Envío a domicilio</td>
                  <td className="py-3 pr-6">CABA y GBA</td>
                  <td className="py-3 pr-6">3–5 días hábiles</td>
                  <td className="py-3">Calculado al checkout</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6">Envío a domicilio</td>
                  <td className="py-3 pr-6">Interior del país</td>
                  <td className="py-3 pr-6">5–10 días hábiles</td>
                  <td className="py-3">Calculado al checkout</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6">Retiro en teatro</td>
                  <td className="py-3 pr-6">Buenos Aires</td>
                  <td className="py-3 pr-6">Fecha de función</td>
                  <td className="py-3">Sin cargo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Embalaje</h2>
          <p>
            Los vinos se envían en cajas especiales con protección individual para cada botella. Nos
            preocupamos por que el producto llegue en perfectas condiciones.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Seguimiento</h2>
          <p>
            Una vez despachado el pedido, recibirá un email con el número de seguimiento para
            rastrear su envío en tiempo real.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Problemas con el envío</h2>
          <p>
            Si su pedido llegó dañado o no coincide con lo comprado, contáctenos dentro de las 48
            horas de recibido en{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-primary underline underline-offset-2"
            >
              {siteConfig.contact.email}
            </a>{' '}
            adjuntando fotos del producto y el embalaje.
          </p>
        </section>
      </div>
    </div>
  );
}
