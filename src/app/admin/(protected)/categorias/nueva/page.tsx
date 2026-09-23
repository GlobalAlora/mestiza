import Link from 'next/link';
import { createCategory } from '../actions';
import { CategoryForm } from '../_components/category-form';

export const metadata = { title: 'Nueva categoría' };

export default function NewCategoryPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/categorias" className="text-muted hover:text-ink text-sm">
          ← Categorías
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">Nueva categoría</h1>
      </div>
      <CategoryForm action={createCategory} submitLabel="Crear categoría" />
    </div>
  );
}
