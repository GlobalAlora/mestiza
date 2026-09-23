import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateProduct } from '../actions';
import { ProductForm } from '../_components/product-form';
import { ImageManager } from '../_components/image-manager';

export const metadata = { title: 'Editar producto' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    db.from('products').select('*, product_variants(*), product_images(*)').eq('id', id).single(),
    db.from('categories').select('id, name').order('name'),
  ]);

  if (!product) notFound();

  const variants = [...(product.product_variants ?? [])].sort((a, b) => a.position - b.position);
  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/productos" className="text-muted hover:text-ink text-sm">
          ← Productos
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">{product.name}</h1>
      </div>

      <div className="space-y-6">
        <ProductForm
          action={updateWithId}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? '',
            category_id: product.category_id ?? '',
            status: product.status,
            variants,
          }}
          categories={categories ?? []}
          submitLabel="Guardar cambios"
        />

        <ImageManager productId={id} images={images} />
      </div>
    </div>
  );
}
