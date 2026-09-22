import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: `Política de privacidad | ${siteConfig.name}`,
  description: `Política de privacidad y tratamiento de datos personales de ${siteConfig.name}.`,
  path: '/legal/privacidad',
  noIndex: true,
});

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-primary mb-2 font-serif text-4xl">Política de privacidad</h1>
      <p className="text-muted mb-12 text-xs">Última actualización: septiembre 2026</p>

      <div className="text-ink space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-base font-semibold">1. Datos que recolectamos</h2>
          <p>
            Recolectamos únicamente los datos necesarios para procesar y entregar su pedido: nombre,
            email, teléfono y dirección de envío. Opcionalmente, el email para comunicar novedades
            (con su consentimiento explícito).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">2. Uso de los datos</h2>
          <p>
            Sus datos se utilizan para: (a) procesar y gestionar su pedido; (b) enviar
            confirmaciones y actualizaciones sobre el estado del pedido; (c) cumplir con
            obligaciones legales y fiscales.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">3. Almacenamiento y seguridad</h2>
          <p>
            Los datos se almacenan en servidores seguros (Supabase / infraestructura en la nube con
            cifrado en reposo y en tránsito). No compartimos datos personales con terceros, excepto
            los proveedores de pago (Mercado Pago) y logística necesarios para completar su pedido.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">4. Sus derechos (Ley 25.326 ARCO)</h2>
          <p>
            De acuerdo con la Ley 25.326 de Protección de Datos Personales, usted tiene derecho a
            acceder, rectificar, cancelar y oponerse al tratamiento de sus datos. Para ejercer estos
            derechos, contáctenos en{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-primary underline underline-offset-2"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">5. Cookies</h2>
          <p>
            Utilizamos una cookie técnica (<code>sm_age_ok</code>) para recordar la verificación de
            edad durante 30 días. No utilizamos cookies de seguimiento ni publicidad de terceros.
          </p>
        </section>
      </div>
    </div>
  );
}
