'use client';

import { useState, useTransition } from 'react';
import { saveNavAction } from './actions';

type NavItem = { label: string; href: string };

export function NavEditor({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(index: number, field: keyof NavItem, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    setItems((prev) => [...prev, { label: '', href: '/' }]);
  }

  function move(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      const temp = next[index]!;
      next[index] = next[target]!;
      next[target] = temp;
      return next;
    });
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveNavAction(items);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({
          type: 'success',
          text: 'Menú guardado. Los cambios son visibles de inmediato.',
        });
      }
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-ink text-2xl font-semibold">Menú de navegación</h1>
        <p className="text-muted mt-1 text-sm">
          Los ítems se muestran divididos en el header: mitad izquierda del logo, mitad derecha.
        </p>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 text-xs font-medium tracking-wide text-zinc-400 uppercase">
            <span className="w-8" />
            <span>Nombre visible</span>
            <span>URL</span>
            <span className="w-20" />
          </div>
        </div>

        <div className="divide-y">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3 px-6 py-3"
            >
              <div className="flex w-8 flex-col gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20"
                  title="Subir"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20"
                  title="Bajar"
                >
                  ▼
                </button>
              </div>

              <input
                value={item.label}
                onChange={(e) => update(i, 'label', e.target.value)}
                placeholder="Nombre visible"
                className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              />

              <input
                value={item.href}
                onChange={(e) => update(i, 'href', e.target.value)}
                placeholder="/ruta"
                className="border-border text-ink focus:ring-primary w-full border px-3 py-2 font-mono text-sm outline-none focus:ring-2"
              />

              <button
                onClick={() => remove(i)}
                className="w-20 text-sm text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={add}
            className="border-border text-ink border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            + Agregar ítem
          </button>

          <div className="flex items-center gap-4">
            {message && (
              <p
                className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
              >
                {message.text}
              </p>
            )}
            <button
              onClick={save}
              disabled={isPending}
              className="bg-primary text-surface px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
