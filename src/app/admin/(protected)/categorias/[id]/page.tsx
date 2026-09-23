import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateCategory } from '../actions';
import { CategoryForm } from '../_components/category-form';

export const metadata = { title: 'Editar categoría' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: category } = await db.from('categories').select('*').eq('id', id).single();

  if (!category) notFound();

  const updateWithId = updateCategory.bind(null, id);

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/categorias" className="text-muted hover:text-ink text-sm">
          ← Categorías
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">{category.name}</h1>
      </div>
      <CategoryForm
        action={updateWithId}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          position: category.position,
        }}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
