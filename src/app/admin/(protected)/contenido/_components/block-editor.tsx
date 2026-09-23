'use client';

import { useState } from 'react';
import { upsertContentBlock } from '../actions';

type Block = {
  id: string;
  key: string;
  value: Record<string, unknown>;
};

function BlockEditor({ block }: { block: Block }) {
  const [fields, setFields] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(block.value).map(([k, v]) => [
        k,
        typeof v === 'string' ? v : JSON.stringify(v),
      ]),
    ),
  );
  const [newKey, setNewKey] = useState('');
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setPending(true);
    const parsed: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      try {
        parsed[k] = JSON.parse(v);
      } catch {
        parsed[k] = v;
      }
    }
    await upsertContentBlock(block.key, parsed);
    setSaved(true);
    setPending(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const addField = () => {
    if (!newKey.trim()) return;
    setFields((prev) => ({ ...prev, [newKey.trim()]: '' }));
    setNewKey('');
  };

  const removeField = (k: string) => {
    setFields((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  return (
    <div className="border-border rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <code className="text-primary bg-primary/8 rounded px-2 py-0.5 font-mono text-sm">
          {block.key}
        </code>
        <div className="flex items-center gap-3">
          {saved && <span className="text-success text-xs">¡Guardado!</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="bg-primary text-surface px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(fields).map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <div className="grid flex-1 grid-cols-5 gap-2">
              <div className="col-span-2">
                <p className="text-muted mb-1 text-xs font-medium">{k}</p>
              </div>
              <div className="col-span-3">
                <textarea
                  value={v}
                  onChange={(e) => setFields((prev) => ({ ...prev, [k]: e.target.value }))}
                  rows={v.startsWith('[') || v.startsWith('{') ? 4 : 2}
                  className="border-border text-ink focus:ring-primary w-full border px-2.5 py-1.5 font-mono text-sm outline-none focus:ring-2"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeField(k)}
              className="text-error mt-5 text-xs hover:underline"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="border-border mt-4 flex items-center gap-2 border-t pt-4">
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addField())}
          className="border-border text-ink focus:ring-primary w-40 border px-2.5 py-1.5 text-xs outline-none focus:ring-2"
          placeholder="nuevo_campo"
        />
        <button type="button" onClick={addField} className="text-primary text-xs hover:underline">
          + Agregar campo
        </button>
      </div>
    </div>
  );
}

export function BlockList({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        No hay bloques de contenido aún. Se crean automáticamente cuando la tienda los necesita.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {blocks.map((b) => (
        <BlockEditor key={b.id} block={b} />
      ))}
    </div>
  );
}
