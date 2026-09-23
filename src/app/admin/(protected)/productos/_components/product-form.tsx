'use client';

import Link from 'next/link';
import { useState } from 'react';
import { slugify } from '@/lib/utils';

type Variant = {
  id?: string;
  name: string;
  sku: string;
  price: string;
  compare_at: string;
  stock: string;
  weight: string;
};

type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    category_id: string;
    status: string;
    variants: Array<{
      id?: string;
      name: string;
      sku: string;
      price_cents: number;
      compare_at_price_cents: number | null;
      stock: number;
      weight_grams: number | null;
    }>;
  };
  categories: Category[];
  submitLabel: string;
};

function emptyVariant(): Variant {
  return { name: '', sku: '', price: '', compare_at: '', stock: '0', weight: '' };
}

export function ProductForm({ action, defaultValues, categories, submitLabel }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [slug, setSlug] = useState(defaultValues?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug);
  const [variants, setVariants] = useState<Variant[]>(
    defaultValues?.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: String(v.price_cents / 100),
      compare_at: v.compare_at_price_cents != null ? String(v.compare_at_price_cents / 100) : '',
      stock: String(v.stock),
      weight: v.weight_grams != null ? String(v.weight_grams) : '',
    })) ?? [emptyVariant()],
  );
  const [pending, setPending] = useState(false);

  const updateVariant = (i: number, field: keyof Variant, value: string) => {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (i: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const serializeVariants = () =>
    variants.map((v, i) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price_cents: Math.round(parseFloat(v.price || '0') * 100),
      compare_at_price_cents: v.compare_at ? Math.round(parseFloat(v.compare_at) * 100) : null,
      stock: parseInt(v.stock || '0'),
      weight_grams: v.weight ? parseInt(v.weight) : null,
      position: i,
    }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set('slug', slug);
    fd.set('variants', JSON.stringify(serializeVariants()));
    try {
      await action(fd);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Info básica */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-ink mb-5 font-semibold">Información básica</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Nombre *</label>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugManual) setSlug(slugify(e.target.value));
              }}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Soy Mestiza Malbec"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">
              Slug (URL) *
              {!slugManual && <span className="text-muted ml-2 text-xs font-normal">(auto)</span>}
            </label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="soy-mestiza-malbec"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-ink mb-1 block text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={defaultValues?.description ?? ''}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Descripción del producto…"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Categoría</label>
            <select
              name="category_id"
              defaultValue={defaultValues?.category_id ?? ''}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Estado</label>
            <select
              name="status"
              defaultValue={defaultValues?.status ?? 'draft'}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        </div>
      </section>

      {/* Variantes */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-ink font-semibold">Variantes</h2>
          <button
            type="button"
            onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
            className="text-primary text-sm font-medium hover:underline"
          >
            + Agregar variante
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((v, i) => (
            <div key={i} className="border-border rounded border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-ink text-sm font-medium">Variante {i + 1}</span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-error text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-muted mb-1 block text-xs">Nombre *</label>
                  <input
                    required
                    value={v.name}
                    onChange={(e) => updateVariant(i, 'name', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="750 ml"
                  />
                </div>
                <div>
                  <label className="text-muted mb-1 block text-xs">SKU *</label>
                  <input
                    required
                    value={v.sku}
                    onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="SM-MAL-750"
                  />
                </div>
                <div>
                  <label className="text-muted mb-1 block text-xs">Precio (ARS) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.price}
                    onChange={(e) => updateVariant(i, 'price', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="text-muted mb-1 block text-xs">Precio tachado</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.compare_at}
                    onChange={(e) => updateVariant(i, 'compare_at', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="text-muted mb-1 block text-xs">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-muted mb-1 block text-xs">Peso (gramos)</label>
                  <input
                    type="number"
                    min="0"
                    value={v.weight}
                    onChange={(e) => updateVariant(i, 'weight', e.target.value)}
                    className="border-border focus:ring-primary w-full border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="750"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-surface px-6 py-2.5 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? 'Guardando…' : submitLabel}
        </button>
        <Link
          href="/admin/productos"
          className="border-border text-ink rounded border px-6 py-2.5 text-sm transition-colors hover:bg-zinc-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
