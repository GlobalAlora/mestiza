import { createAdminClient } from '@/lib/supabase/admin';
import { BlockList } from './_components/block-editor';

export const metadata = { title: 'Contenido' };

export default async function ContentPage() {
  const db = createAdminClient();
  const { data: blocks } = await db.from('content_blocks').select('id, key, value').order('key');

  const typedBlocks = (blocks ?? []).map((b) => ({
    id: b.id,
    key: b.key,
    value: (b.value ?? {}) as Record<string, unknown>,
  }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-ink text-2xl font-semibold">Bloques de contenido</h1>
        <p className="text-muted mt-1 text-sm">
          Editá los textos e imágenes que aparecen en la tienda. Los cambios se aplican
          inmediatamente.
        </p>
      </div>

      <BlockList blocks={typedBlocks} />
    </div>
  );
}
