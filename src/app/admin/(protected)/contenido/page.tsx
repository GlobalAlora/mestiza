import { createAdminClient } from '@/lib/supabase/admin';
import { ContentSection } from './_components/content-section';
import type { FieldDef } from './_components/content-section';

export const metadata = { title: 'Contenido' };

const SECTIONS: { title: string; description: string; fields: FieldDef[] }[] = [
  {
    title: 'General',
    description: 'Datos del sitio que aparecen en varias páginas.',
    fields: [
      {
        key: 'general.tagline',
        label: 'Tagline',
        type: 'input',
        placeholder: 'Vinos de altura del corazón de Cuyo.',
      },
      {
        key: 'general.origin',
        label: 'Origen',
        type: 'input',
        placeholder: 'Calingasta, San Juan, Argentina',
      },
      {
        key: 'general.award',
        label: 'Premio',
        type: 'input',
        placeholder: 'Carlos de Oro · Villa Carlos Paz',
      },
      {
        key: 'general.instagram',
        label: 'Instagram (URL)',
        type: 'input',
        placeholder: 'https://instagram.com/soymestiza',
      },
      {
        key: 'general.contact_email',
        label: 'Email de contacto',
        type: 'input',
        placeholder: 'hola@soymestiza.com',
      },
      {
        key: 'general.alcohol_warning',
        label: 'Aviso legal (alcohol)',
        type: 'input',
        placeholder: 'Beber con moderación. Prohibida su venta a menores de 18 años.',
      },
    ],
  },
  {
    title: 'Inicio',
    description: 'Textos de la página de inicio.',
    fields: [
      {
        key: 'home.hero_tagline',
        label: 'Tagline hero',
        type: 'input',
        placeholder: 'Vinos de altura del corazón de Cuyo.',
      },
      {
        key: 'home.hero_cta',
        label: 'Botón principal',
        type: 'input',
        placeholder: 'Explorar vinos',
      },
      {
        key: 'home.featured_label',
        label: 'Etiqueta productos (pequeña)',
        type: 'input',
        placeholder: 'Nuestros vinos',
      },
      {
        key: 'home.featured_title',
        label: 'Título sección productos',
        type: 'input',
        placeholder: 'Colección',
      },
      {
        key: 'home.obra_title',
        label: 'Título sección "La obra"',
        type: 'input',
        placeholder: 'Como el vino, Soy Mestiza',
      },
      {
        key: 'home.obra_body',
        label: 'Texto sección "La obra"',
        type: 'textarea',
        rows: 4,
        placeholder:
          'Ganadora del Carlos de Oro · Villa Carlos Paz. Flamenco, música árabe, folclore y tango fundidos en una propuesta única…',
      },
      {
        key: 'home.obra_cta',
        label: 'Texto link "La obra"',
        type: 'input',
        placeholder: 'Conocé la historia →',
      },
    ],
  },
  {
    title: 'Historia',
    description: 'Textos de la página Historia.',
    fields: [
      {
        key: 'historia.title',
        label: 'Título de la página',
        type: 'input',
        placeholder: 'Como el vino, Soy Mestiza',
      },
      {
        key: 'historia.opening',
        label: 'Párrafo de apertura',
        type: 'textarea',
        rows: 5,
        placeholder:
          'Soy Mestiza es un vino de altura nacido del encuentro entre el escenario y la tierra…',
      },
      {
        key: 'historia.quote',
        label: 'Cita destacada',
        type: 'textarea',
        rows: 3,
        placeholder: 'Flamenco, música árabe, folclore y tango fundidos en una sola voz…',
      },
      {
        key: 'historia.body1',
        label: 'Párrafo 1 (viñedos)',
        type: 'textarea',
        rows: 4,
        placeholder: 'Los viñedos se ubican a más de…',
      },
      {
        key: 'historia.body2',
        label: 'Párrafo 2 (identidad)',
        type: 'textarea',
        rows: 4,
        placeholder: 'Cada botella de Soy Mestiza lleva consigo…',
      },
      {
        key: 'historia.region_body',
        label: 'Texto "La región"',
        type: 'textarea',
        rows: 4,
        placeholder: 'Valle de Calingasta, San Juan, Argentina…',
      },
      {
        key: 'historia.section_label',
        label: 'Etiqueta sección (ej. "La obra")',
        type: 'input',
        placeholder: 'La obra',
      },
      {
        key: 'historia.region_label',
        label: 'Etiqueta región (ej. "La región")',
        type: 'input',
        placeholder: 'La región',
      },
      {
        key: 'historia.cta_tienda',
        label: 'Botón "Conocé los vinos"',
        type: 'input',
        placeholder: 'Conocé los vinos',
      },
      {
        key: 'historia.cta_contacto',
        label: 'Link "Contactanos"',
        type: 'input',
        placeholder: 'Contactanos',
      },
    ],
  },
  {
    title: 'Tienda',
    description: 'Textos de la página de tienda.',
    fields: [
      { key: 'tienda.title', label: 'Título de la tienda', type: 'input', placeholder: 'Tienda' },
    ],
  },
  {
    title: 'Producto',
    description: 'Textos de la página de producto.',
    fields: [
      {
        key: 'producto.related_title',
        label: 'Título productos relacionados',
        type: 'input',
        placeholder: 'También te puede gustar',
      },
      {
        key: 'producto.breadcrumb_tienda',
        label: 'Link miga de pan "Tienda"',
        type: 'input',
        placeholder: 'Tienda',
      },
      {
        key: 'producto.unit_altitude',
        label: 'Unidad altitud (ej. "msnm")',
        type: 'input',
        placeholder: 'msnm',
      },
      {
        key: 'producto.unit_alcohol',
        label: 'Unidad alcohol (ej. "% alc.")',
        type: 'input',
        placeholder: '% alc.',
      },
    ],
  },
  {
    title: 'Inicio — extras',
    description: 'Textos adicionales de la página de inicio.',
    fields: [
      {
        key: 'home.obra_label',
        label: 'Etiqueta sección "La obra"',
        type: 'input',
        placeholder: 'La obra',
      },
      {
        key: 'home.featured_all_cta',
        label: 'Link "Ver toda la tienda"',
        type: 'input',
        placeholder: 'Ver toda la tienda',
      },
    ],
  },
  {
    title: 'Contacto',
    description: 'Textos de la página de contacto.',
    fields: [
      { key: 'contacto.title', label: 'Título', type: 'input', placeholder: 'Contacto' },
      {
        key: 'contacto.subtitle',
        label: 'Subtítulo',
        type: 'input',
        placeholder: 'Escribinos, con gusto te respondemos.',
      },
      {
        key: 'contacto.email_note',
        label: 'Nota de email',
        type: 'input',
        placeholder: 'También podés escribirnos a',
      },
      { key: 'contacto.field_nombre', label: 'Campo Nombre', type: 'input', placeholder: 'Nombre' },
      { key: 'contacto.field_email', label: 'Campo Email', type: 'input', placeholder: 'Email' },
      {
        key: 'contacto.field_mensaje',
        label: 'Campo Mensaje',
        type: 'input',
        placeholder: 'Mensaje',
      },
    ],
  },
  {
    title: 'Carrito',
    description: 'Textos del carrito de compras.',
    fields: [
      {
        key: 'carrito.empty_title',
        label: 'Título carrito vacío',
        type: 'input',
        placeholder: 'Tu carrito está vacío',
      },
      {
        key: 'carrito.empty_body',
        label: 'Texto carrito vacío',
        type: 'input',
        placeholder: 'Explorá nuestra selección de vinos y encontrá el tuyo.',
      },
      {
        key: 'carrito.empty_cta',
        label: 'Botón carrito vacío',
        type: 'input',
        placeholder: 'Ir a la tienda',
      },
      { key: 'carrito.title', label: 'Título carrito', type: 'input', placeholder: 'Tu carrito' },
      {
        key: 'carrito.remove_item',
        label: 'Botón eliminar producto',
        type: 'input',
        placeholder: 'Eliminar',
      },
      {
        key: 'carrito.clear_cart',
        label: 'Botón vaciar carrito',
        type: 'input',
        placeholder: 'Vaciar carrito',
      },
      {
        key: 'carrito.summary_title',
        label: 'Título resumen',
        type: 'input',
        placeholder: 'Resumen',
      },
      {
        key: 'carrito.subtotal_label',
        label: 'Etiqueta subtotal',
        type: 'input',
        placeholder: 'Subtotal',
      },
      {
        key: 'carrito.shipping_label',
        label: 'Etiqueta envío',
        type: 'input',
        placeholder: 'Envío',
      },
      {
        key: 'carrito.shipping_tbd',
        label: 'Envío a calcular',
        type: 'input',
        placeholder: 'A calcular',
      },
      { key: 'carrito.total_label', label: 'Etiqueta total', type: 'input', placeholder: 'Total' },
      {
        key: 'carrito.checkout_cta',
        label: 'Botón ir al checkout',
        type: 'input',
        placeholder: 'Continuar al pago',
      },
      {
        key: 'carrito.continue_shopping',
        label: 'Link seguir comprando',
        type: 'input',
        placeholder: 'Seguir comprando',
      },
      {
        key: 'carrito.terms_note',
        label: 'Nota términos',
        type: 'input',
        placeholder: 'Al confirmar tu compra aceptás nuestros',
      },
      {
        key: 'carrito.terms_link_text',
        label: 'Texto link términos',
        type: 'input',
        placeholder: 'Términos y condiciones',
      },
    ],
  },
  {
    title: 'Checkout',
    description: 'Textos del proceso de compra.',
    fields: [
      { key: 'checkout.title', label: 'Título', type: 'input', placeholder: 'Checkout' },
      { key: 'checkout.step_contact', label: 'Paso 1: Datos', type: 'input', placeholder: 'Datos' },
      {
        key: 'checkout.step_shipping',
        label: 'Paso 2: Envío',
        type: 'input',
        placeholder: 'Envío',
      },
      {
        key: 'checkout.step_review',
        label: 'Paso 3: Revisión',
        type: 'input',
        placeholder: 'Revisión',
      },
      {
        key: 'checkout.contact_title',
        label: 'Título datos de contacto',
        type: 'input',
        placeholder: 'Datos de contacto',
      },
      { key: 'checkout.field_nombre', label: 'Campo Nombre', type: 'input', placeholder: 'Nombre' },
      {
        key: 'checkout.field_apellido',
        label: 'Campo Apellido',
        type: 'input',
        placeholder: 'Apellido',
      },
      { key: 'checkout.field_email', label: 'Campo Email', type: 'input', placeholder: 'Email' },
      {
        key: 'checkout.field_telefono',
        label: 'Campo Teléfono',
        type: 'input',
        placeholder: 'Teléfono',
      },
      {
        key: 'checkout.btn_continue',
        label: 'Botón Continuar',
        type: 'input',
        placeholder: 'Continuar',
      },
      { key: 'checkout.btn_back', label: 'Botón Atrás', type: 'input', placeholder: 'Atrás' },
      {
        key: 'checkout.shipping_title',
        label: 'Título método de envío',
        type: 'input',
        placeholder: 'Método de envío',
      },
      {
        key: 'checkout.no_shipping_methods',
        label: 'Sin métodos disponibles',
        type: 'input',
        placeholder: 'No hay métodos de envío disponibles.',
      },
      {
        key: 'checkout.shipping_free',
        label: 'Envío gratis',
        type: 'input',
        placeholder: 'Gratis',
      },
      {
        key: 'checkout.address_title',
        label: 'Título dirección de entrega',
        type: 'input',
        placeholder: 'Dirección de entrega',
      },
      { key: 'checkout.field_calle', label: 'Campo Calle', type: 'input', placeholder: 'Calle' },
      { key: 'checkout.field_numero', label: 'Campo Número', type: 'input', placeholder: 'Número' },
      {
        key: 'checkout.field_piso',
        label: 'Campo Piso / Dpto',
        type: 'input',
        placeholder: 'Piso / Dpto',
      },
      { key: 'checkout.field_ciudad', label: 'Campo Ciudad', type: 'input', placeholder: 'Ciudad' },
      {
        key: 'checkout.field_provincia',
        label: 'Campo Provincia',
        type: 'input',
        placeholder: 'Provincia',
      },
      {
        key: 'checkout.field_cp',
        label: 'Campo Código postal',
        type: 'input',
        placeholder: 'Código postal',
      },
      {
        key: 'checkout.field_notas',
        label: 'Campo Notas de envío',
        type: 'input',
        placeholder: 'Notas de envío (opcional)',
      },
      {
        key: 'checkout.review_title',
        label: 'Título revisión',
        type: 'input',
        placeholder: 'Revisión del pedido',
      },
      {
        key: 'checkout.subtotal_label',
        label: 'Etiqueta Subtotal',
        type: 'input',
        placeholder: 'Subtotal',
      },
      {
        key: 'checkout.shipping_label',
        label: 'Etiqueta Envío',
        type: 'input',
        placeholder: 'Envío',
      },
      { key: 'checkout.total_label', label: 'Etiqueta Total', type: 'input', placeholder: 'Total' },
      {
        key: 'checkout.review_contact_label',
        label: 'Etiqueta Contacto (resumen)',
        type: 'input',
        placeholder: 'Contacto',
      },
      {
        key: 'checkout.review_address_label',
        label: 'Etiqueta Dirección (resumen)',
        type: 'input',
        placeholder: 'Dirección',
      },
      {
        key: 'checkout.review_pickup_label',
        label: 'Etiqueta Retiro (resumen)',
        type: 'input',
        placeholder: 'Retiro',
      },
      {
        key: 'checkout.age_verification',
        label: 'Declaración mayor de edad',
        type: 'textarea',
        rows: 2,
        placeholder: 'Declaro que soy mayor de 18 años…',
      },
      {
        key: 'checkout.btn_processing',
        label: 'Botón procesando',
        type: 'input',
        placeholder: 'Procesando…',
      },
      {
        key: 'checkout.btn_confirm',
        label: 'Botón confirmar y pagar',
        type: 'input',
        placeholder: 'Confirmar y pagar',
      },
      {
        key: 'checkout.empty_cart',
        label: 'Carrito vacío (texto)',
        type: 'input',
        placeholder: 'Tu carrito está vacío.',
      },
      {
        key: 'checkout.empty_cart_cta',
        label: 'Carrito vacío (CTA)',
        type: 'input',
        placeholder: 'Ver productos',
      },
    ],
  },
  {
    title: 'Confirmación / Pago fallido',
    description: 'Textos de las páginas de resultado del pedido.',
    fields: [
      {
        key: 'confirmacion.title_pending',
        label: 'Título pedido recibido',
        type: 'input',
        placeholder: '¡Pedido recibido!',
      },
      {
        key: 'confirmacion.title_confirmed',
        label: 'Título pago confirmado',
        type: 'input',
        placeholder: '¡Pago confirmado!',
      },
      {
        key: 'confirmacion.thanks_suffix',
        label: 'Sufijo de agradecimiento',
        type: 'input',
        placeholder: 'gracias por tu compra.',
      },
      {
        key: 'confirmacion.label_estado',
        label: 'Etiqueta Estado',
        type: 'input',
        placeholder: 'Estado',
      },
      {
        key: 'confirmacion.status_pending',
        label: 'Estado: esperando pago',
        type: 'input',
        placeholder: 'Esperando confirmación de pago',
      },
      {
        key: 'confirmacion.status_confirmed',
        label: 'Estado: pago aprobado',
        type: 'input',
        placeholder: 'Pago aprobado',
      },
      {
        key: 'confirmacion.label_envio',
        label: 'Etiqueta Envío',
        type: 'input',
        placeholder: 'Envío',
      },
      {
        key: 'confirmacion.label_total',
        label: 'Etiqueta Total',
        type: 'input',
        placeholder: 'Total',
      },
      {
        key: 'confirmacion.email_notice',
        label: 'Aviso email de pedido',
        type: 'textarea',
        rows: 2,
        placeholder: 'Te enviamos un email con los detalles de tu pedido…',
      },
      {
        key: 'confirmacion.cta_shopping',
        label: 'Botón seguir comprando',
        type: 'input',
        placeholder: 'Seguir comprando',
      },
      {
        key: 'confirmacion.not_found',
        label: 'Pedido no encontrado',
        type: 'input',
        placeholder: 'Pedido no encontrado.',
      },
      {
        key: 'confirmacion.not_found_cta',
        label: 'CTA pedido no encontrado',
        type: 'input',
        placeholder: 'Volver a la tienda',
      },
      {
        key: 'fallido.title',
        label: 'Título pago fallido',
        type: 'input',
        placeholder: 'El pago no se pudo procesar',
      },
      {
        key: 'fallido.order_suffix',
        label: 'Sufijo número de pedido (fallido)',
        type: 'input',
        placeholder: 'el pago fue rechazado o cancelado.',
      },
      {
        key: 'fallido.body',
        label: 'Cuerpo pago fallido',
        type: 'textarea',
        rows: 2,
        placeholder: 'Podés intentar con otro medio de pago o volver a tu carrito.',
      },
      {
        key: 'fallido.cta_carrito',
        label: 'Botón volver al carrito',
        type: 'input',
        placeholder: 'Volver al carrito',
      },
      {
        key: 'fallido.cta_tienda',
        label: 'Botón ver tienda',
        type: 'input',
        placeholder: 'Ver tienda',
      },
    ],
  },
];

export default async function ContentPage() {
  const db = createAdminClient();
  const { data: blocks } = await db.from('content_blocks').select('key, value').order('key');

  const values: Record<string, string> = {};
  for (const block of blocks ?? []) {
    const v = block.value as unknown;
    if (typeof v === 'string') {
      values[block.key] = v;
    } else if (typeof v === 'object' && v !== null && 'text' in v) {
      values[block.key] = String((v as Record<string, unknown>).text ?? '');
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-ink text-2xl font-semibold">Contenido</h1>
        <p className="text-muted mt-1 text-sm">
          Editá los textos de la tienda. Los cambios se publican de inmediato.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <ContentSection
            key={section.title}
            title={section.title}
            description={section.description}
            fields={section.fields}
            values={values}
          />
        ))}
      </div>
    </div>
  );
}
