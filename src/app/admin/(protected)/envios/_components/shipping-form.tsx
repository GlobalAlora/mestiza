'use client';

import Link from 'next/link';
import { useState } from 'react';

type Zone = { name: string; price: string };

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    type: string;
    is_active: boolean;
    position: number;
    zones: Array<{ name: string; price_cents: number }>;
  };
  submitLabel: string;
};

function emptyZone(): Zone {
  return { name: '', price: '' };
}

export function ShippingForm({ action, defaultValues, submitLabel }: Props) {
  const [zones, setZones] = useState<Zone[]>(
    defaultValues?.zones.map((z) => ({
      name: z.name,
      price: String(z.price_cents / 100),
    })) ?? [],
  );
  const [pending, setPending] = useState(false);

  const updateZone = (i: number, field: keyof Zone, value: string) => {
    setZones((prev) => prev.map((z, idx) => (idx === i ? { ...z, [field]: value } : z)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set(
      'zones',
      JSON.stringify(
        zones.map((z) => ({
          name: z.name,
          price_cents: Math.round(parseFloat(z.price || '0') * 100),
        })),
      ),
    );
    try {
      await action(fd);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Nombre *</label>
            <input
              name="name"
              required
              defaultValue={defaultValues?.name ?? ''}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Envío a domicilio CABA"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Tipo *</label>
            <select
              name="type"
              required
              defaultValue={defaultValues?.type ?? 'delivery'}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            >
              <option value="delivery">Envío a domicilio</option>
              <option value="pickup">Retiro en local</option>
              <option value="theater_pickup">Retiro en teatro</option>
            </select>
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Posición</label>
            <input
              name="position"
              type="number"
              min="0"
              defaultValue={defaultValues?.position ?? 0}
              className="border-border text-ink focus:ring-primary w-24 border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">Activo</label>
            <select
              name="is_active"
              defaultValue={String(defaultValues?.is_active ?? true)}
              className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Zonas de precio */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-ink text-sm font-medium">Zonas y precios</label>
            <button
              type="button"
              onClick={() => setZones((prev) => [...prev, emptyZone()])}
              className="text-primary text-xs hover:underline"
            >
              + Agregar zona
            </button>
          </div>

          {zones.length === 0 ? (
            <p className="text-muted text-xs">Sin zonas (se puede usar como tarifa fija)</p>
          ) : (
            <div className="space-y-2">
              {zones.map((z, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={z.name}
                    onChange={(e) => updateZone(i, 'name', e.target.value)}
                    className="border-border text-ink focus:ring-primary flex-1 border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="Nombre de zona (ej: CABA)"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={z.price}
                    onChange={(e) => updateZone(i, 'price', e.target.value)}
                    className="border-border text-ink focus:ring-primary w-28 border px-2.5 py-1.5 text-sm outline-none focus:ring-2"
                    placeholder="Precio ARS"
                  />
                  <button
                    type="button"
                    onClick={() => setZones((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-error text-xs hover:underline"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
          href="/admin/envios"
          className="border-border text-ink rounded border px-6 py-2.5 text-sm transition-colors hover:bg-zinc-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
