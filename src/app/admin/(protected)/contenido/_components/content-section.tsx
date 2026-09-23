'use client';

import { useState, useTransition } from 'react';
import { saveSection } from '../actions';

export type FieldDef = {
  key: string;
  label: string;
  type: 'input' | 'textarea';
  placeholder?: string;
  rows?: number;
};

type Props = {
  title: string;
  description?: string;
  fields: FieldDef[];
  values: Record<string, string>;
};

export function ContentSection({ title, description, fields, values }: Props) {
  const [state, setState] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? ''])),
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      await saveSection(fields.map((f) => ({ key: f.key, text: state[f.key] ?? '' })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-ink text-base font-semibold">{title}</h2>
          {description && <p className="text-muted mt-0.5 text-xs">{description}</p>}
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          {saved && <span className="text-xs text-green-600">✓ Guardado</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="bg-primary text-surface rounded px-4 py-1.5 text-xs font-medium transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-muted mb-1 block text-xs font-medium tracking-wide uppercase">
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea
                rows={f.rows ?? 4}
                value={state[f.key] ?? ''}
                onChange={(e) => setState((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              />
            ) : (
              <input
                type="text"
                value={state[f.key] ?? ''}
                onChange={(e) => setState((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
