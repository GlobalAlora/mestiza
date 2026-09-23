import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createProduct } from '../actions';
import { ProductForm } from '../_components/product-form';

export const metadata = { title: 'Nuevo producto' };

export default async function NewProductPage() {
  const db = createAdminClient();
  const { data: categories } = await db.from('categories').select('id, name').order('name');

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/productos" className="text-muted hover:text-ink text-sm">
          ← Productos
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">Nuevo producto</h1>
      </div>

      <ProductForm
        action={createProduct}
        categories={categories ?? []}
        submitLabel="Crear producto"
      />
    </div>
  );
}
