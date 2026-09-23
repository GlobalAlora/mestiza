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
