'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdminSession } from '@/lib/supabase/require-admin';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type VariantInput = {
  id?: string;
  name: string;
  sku: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock: number;
  weight_grams: number | null;
  position: number;
};

export async function createProduct(formData: FormData) {
  await requireAdminSession();
  const db = createAdminClient();

  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || slugify(name);
  const description = (formData.get('description') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;
  const status = (formData.get('status') as 'draft' | 'published' | 'archived') ?? 'draft';
  const variantsJson = formData.get('variants') as string;
  const variants: VariantInput[] = variantsJson ? JSON.parse(variantsJson) : [];

  const { data: product, error } = await db
    .from('products')
    .insert({ name, slug, description, category_id, status })
    .select('id')
    .single();

  if (error || !product) throw new Error(error?.message ?? 'Error al crear producto');

  if (variants.length > 0) {
    await db.from('product_variants').insert(
      variants.map((v, i) => ({
        product_id: product.id,
        name: v.name,
        sku: v.sku,
        price_cents: v.price_cents,
        compare_at_price_cents: v.compare_at_price_cents,
        stock: v.stock,
        weight_grams: v.weight_grams,
        position: i,
      })),
    );
  }

  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
  redirect(`/admin/productos/${product.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdminSession();
  const db = createAdminClient();

  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || slugify(name);
  const description = (formData.get('description') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;
  const status = formData.get('status') as 'draft' | 'published' | 'archived';
  const variantsJson = formData.get('variants') as string;
  const variants: VariantInput[] = variantsJson ? JSON.parse(variantsJson) : [];

  const { error } = await db
    .from('products')
    .update({ name, slug, description, category_id, status })
    .eq('id', id);

  if (error) throw new Error(error.message);

  // Sync variants: delete all and re-insert (simple approach)
  await db.from('product_variants').delete().eq('product_id', id);
  if (variants.length > 0) {
    await db.from('product_variants').insert(
      variants.map((v, i) => ({
        product_id: id,
        name: v.name,
        sku: v.sku,
        price_cents: v.price_cents,
        compare_at_price_cents: v.compare_at_price_cents,
        stock: v.stock,
        weight_grams: v.weight_grams,
        position: i,
      })),
    );
  }

  revalidatePath('/admin/productos');
  revalidatePath(`/producto/${slug}`);
  revalidatePath('/tienda');
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
  const db = createAdminClient();

  // Fetch image paths to delete from storage
  const { data: images } = await db
    .from('product_images')
    .select('storage_path')
    .eq('product_id', id);

  if (images && images.length > 0) {
    await db.storage.from('products').remove(images.map((img) => img.storage_path));
  }

  await db.from('products').delete().eq('id', id);

  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
  redirect('/admin/productos');
}

export async function uploadProductImage(productId: string, formData: FormData) {
  await requireAdminSession();
  const db = createAdminClient();
  const file = formData.get('image') as File;
  if (!file || file.size === 0) return;

  if (!ALLOWED_IMAGE_TYPES[file.type])
    throw new Error('Tipo de archivo no permitido. Usá JPG, PNG o WebP.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('El archivo supera el límite de 5 MB.');

  const ext = ALLOWED_IMAGE_TYPES[file.type];
  const path = `${productId}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await db.storage
    .from('products')
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: existing } = await db
    .from('product_images')
    .select('position')
    .eq('product_id', productId)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (existing?.position ?? -1) + 1;
  await db.from('product_images').insert({
    product_id: productId,
    storage_path: path,
    alt_text: null,
    position: nextPosition,
  });

  revalidatePath(`/admin/productos/${productId}`);
}

export async function deleteProductImage(imageId: string, storagePath: string, productId: string) {
  await requireAdminSession();
  const db = createAdminClient();
  await db.storage.from('products').remove([storagePath]);
  await db.from('product_images').delete().eq('id', imageId);
  revalidatePath(`/admin/productos/${productId}`);
}
