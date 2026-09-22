import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = buildMetadata({
  title: `Botón de arrepentimiento | ${siteConfig.name}`,
  description: `Política de devoluciones y botón de arrepentimiento de ${siteConfig.name} según Ley 24.240.`,
  path: '/legal/arrepentimiento',
  noIndex: true,
});

export default function ArrepentimientoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-primary mb-2 font-serif text-4xl">Botón de arrepentimiento</h1>
      <p className="text-muted mb-12 text-xs">Última actualización: septiembre 2026</p>

      <div className="text-ink space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-base font-semibold">Su derecho de arrepentimiento</h2>
          <p>
            De acuerdo con la Ley 24.240 de Defensa del Consumidor y la Resolución 424/2020 de la
            Secretaría de Comercio Interior, usted tiene derecho a revocar la aceptación de su
            compra dentro de los <strong>10 días corridos</strong> desde que la recibió, sin
            necesidad de explicar los motivos.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Cómo ejercerlo</h2>
          <p className="mb-4">
            Envíe un email a{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-primary underline underline-offset-2"
            >
              {siteConfig.contact.email}
            </a>{' '}
            con el asunto <strong>&quot;Arrepentimiento — Pedido #[número]&quot;</strong> indicando:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Número de pedido</li>
            <li>Nombre y apellido</li>
            <li>Número de DNI</li>
            <li>Motivo (opcional)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Proceso de devolución</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Recibirá confirmación de su solicitud dentro de las 24 horas hábiles.</li>
            <li>Le indicaremos cómo devolver el producto (flete a cargo de {siteConfig.name}).</li>
            <li>
              Una vez recibido el producto en buen estado, procesaremos el reembolso en el mismo
              medio de pago utilizado dentro de los <strong>10 días hábiles</strong>.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">Excepciones</h2>
          <p>
            No aplica el derecho de arrepentimiento cuando el producto fue abierto o consumido
            (salvo defecto de fábrica), ni cuando el producto fue personalizado a pedido del
            cliente.
          </p>
        </section>
      </div>
    </div>
  );
}
