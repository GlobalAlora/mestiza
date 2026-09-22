import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: `Términos y condiciones | ${siteConfig.name}`,
  description: `Términos y condiciones de venta de ${siteConfig.name}.`,
  path: '/legal/terminos',
  noIndex: true,
});

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-primary mb-2 font-serif text-4xl">Términos y condiciones</h1>
      <p className="text-muted mb-12 text-xs">Última actualización: septiembre 2026</p>

      <div className="text-ink space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-base font-semibold">1. Objeto</h2>
          <p>
            Los presentes términos regulan la relación comercial entre {siteConfig.name} y los
            compradores que adquieran productos a través de {siteConfig.url}. Al realizar una
            compra, el cliente acepta estos términos en su totalidad.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">2. Mayoría de edad</h2>
          <p>
            De conformidad con la Ley 24.788 de Lucha contra el Alcoholismo, la venta de bebidas
            alcohólicas está prohibida a menores de 18 años. Al confirmar la compra, el cliente
            declara ser mayor de edad. {siteConfig.name} se reserva el derecho de cancelar pedidos
            cuando no se pueda verificar la mayoría de edad del comprador.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">3. Precios y pagos</h2>
          <p>
            Los precios publicados incluyen IVA y están expresados en pesos argentinos (ARS). Los
            pagos se procesan a través de Mercado Pago. {siteConfig.name} no almacena datos de
            tarjetas de crédito o débito.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">4. Disponibilidad y stock</h2>
          <p>
            Los productos están sujetos a disponibilidad de stock. En caso de agotarse un producto
            tras la confirmación del pedido, {siteConfig.name} se comunicará con el cliente para
            ofrecer una alternativa o el reembolso correspondiente.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">5. Envíos</h2>
          <p>
            Los plazos y costos de envío se informan al momento de la compra. El transporte de
            bebidas alcohólicas está sujeto a la normativa de cada empresa de correo. Consulte
            nuestra{' '}
            <a href="/legal/envios" className="hover:text-primary underline underline-offset-2">
              política de envíos
            </a>{' '}
            para más información.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">6. Contacto</h2>
          <p>
            Para consultas o reclamos:{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-primary underline underline-offset-2"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
