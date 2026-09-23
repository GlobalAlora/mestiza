'use client';

import Link from 'next/link';
import { useState } from 'react';
import { slugify } from '@/lib/utils';

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    position: number;
  };
  submitLabel: string;
};

export function CategoryForm({ action, defaultValues, submitLabel }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [slug, setSlug] = useState(defaultValues?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set('slug', slug);
    try {
      await action(fd);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
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
          />
        </div>

        <div>
          <label className="text-ink mb-1 block text-sm font-medium">
            Slug *
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
          />
        </div>

        <div>
          <label className="text-ink mb-1 block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={defaultValues?.description ?? ''}
            className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="text-ink mb-1 block text-sm font-medium">
            Posición (orden en menú)
          </label>
          <input
            name="position"
            type="number"
            min="0"
            defaultValue={defaultValues?.position ?? 0}
            className="border-border text-ink focus:ring-primary w-24 border px-3 py-2 text-sm outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-surface px-6 py-2.5 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? 'Guardando…' : submitLabel}
        </button>
        <Link
          href="/admin/categorias"
          className="border-border text-ink rounded border px-6 py-2.5 text-sm transition-colors hover:bg-zinc-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
