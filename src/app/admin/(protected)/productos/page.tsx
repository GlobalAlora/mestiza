import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import { DeleteProductButton } from './_components/delete-button';

export const metadata = { title: 'Productos' };

const statusLabel: Record<string, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};
const statusColor: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-zinc-100 text-zinc-600',
};

export default async function ProductsPage() {
  const db = createAdminClient();
  const { data: products } = await db
    .from('products')
    .select('id, name, slug, status, category_id, categories(name), product_variants(price_cents)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-ink text-2xl font-semibold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-primary text-surface px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {!products || products.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">
            No hay productos.{' '}
            <Link href="/admin/productos/nuevo" className="text-primary hover:underline">
              Crear el primero
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-muted px-6 py-3 text-left font-medium">Nombre</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Categoría</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Estado</th>
                  <th className="text-muted px-6 py-3 text-left font-medium">Precio mín.</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => {
                  const prices = (p.product_variants ?? []).map((v) => v.price_cents);
                  const minPrice = prices.length ? Math.min(...prices) : null;
                  const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="text-ink hover:text-primary font-medium"
                        >
                          {p.name}
                        </Link>
                        <p className="text-muted text-xs">{p.slug}</p>
                      </td>
                      <td className="text-muted px-6 py-3">{cat?.name ?? '—'}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[p.status]}`}
                        >
                          {statusLabel[p.status]}
                        </span>
                      </td>
                      <td className="text-ink px-6 py-3 tabular-nums">
                        {minPrice != null ? formatPrice(minPrice) : '—'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="text-primary mr-3 text-xs hover:underline"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
