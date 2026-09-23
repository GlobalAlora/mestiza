import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { DeleteCategoryButton } from './_components/delete-button';

export const metadata = { title: 'Categorías' };

export default async function CategoriesPage() {
  const db = createAdminClient();
  const { data: categories } = await db
    .from('categories')
    .select('id, name, slug, position, description')
    .order('position');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-ink text-2xl font-semibold">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className="bg-primary text-surface px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
        >
          + Nueva categoría
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {!categories || categories.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">
            No hay categorías.{' '}
            <Link href="/admin/categorias/nueva" className="text-primary hover:underline">
              Crear la primera
            </Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-muted px-6 py-3 text-left font-medium">Nombre</th>
                <th className="text-muted px-6 py-3 text-left font-medium">Slug</th>
                <th className="text-muted px-6 py-3 text-left font-medium">Posición</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="text-ink px-6 py-3 font-medium">{c.name}</td>
                  <td className="text-muted px-6 py-3">{c.slug}</td>
                  <td className="text-muted px-6 py-3">{c.position}</td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/admin/categorias/${c.id}`}
                      className="text-primary mr-3 text-xs hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteCategoryButton id={c.id} name={c.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
