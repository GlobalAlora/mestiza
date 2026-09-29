'use client';

import { useState, useTransition } from 'react';
import { saveNavAction } from './actions';

type NavItem = { label: string; href: string };

const btn = (variant: 'primary' | 'danger' | 'ghost'): React.CSSProperties => ({
  padding: variant === 'ghost' ? '6px 12px' : '8px 16px',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.06em',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  background:
    variant === 'primary' ? '#3d1a14' : variant === 'danger' ? 'transparent' : 'transparent',
  color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#b00020' : '#444',
  borderColor: variant === 'primary' ? '#3d1a14' : variant === 'danger' ? '#b00020' : '#ccc',
});

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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 400, margin: 0 }}>
          Menú de navegación
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
          Los ítems se muestran divididos en el header: mitad izquierda del logo, mitad derecha.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 80px',
            gap: 8,
            padding: '0 44px 0 4px',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em' }}>
            NOMBRE
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em' }}>
            URL
          </span>
        </div>

        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 1fr 80px',
              gap: 8,
              alignItems: 'center',
              background: '#fff',
              border: '1px solid #e5e1db',
              padding: '8px 10px',
            }}
          >
            {/* Reorder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Subir"
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: i === 0 ? 'default' : 'pointer',
                  opacity: i === 0 ? 0.25 : 0.6,
                  fontSize: 10,
                  padding: '2px 4px',
                  lineHeight: 1,
                }}
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Bajar"
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: i === items.length - 1 ? 'default' : 'pointer',
                  opacity: i === items.length - 1 ? 0.25 : 0.6,
                  fontSize: 10,
                  padding: '2px 4px',
                  lineHeight: 1,
                }}
              >
                ▼
              </button>
            </div>

            {/* Label */}
            <input
              value={item.label}
              onChange={(e) => update(i, 'label', e.target.value)}
              placeholder="Nombre visible"
              style={{
                border: '1px solid #ddd',
                padding: '6px 10px',
                fontSize: 14,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Href */}
            <input
              value={item.href}
              onChange={(e) => update(i, 'href', e.target.value)}
              placeholder="/ruta"
              style={{
                border: '1px solid #ddd',
                padding: '6px 10px',
                fontSize: 14,
                fontFamily: 'monospace',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {/* Delete */}
            <button
              onClick={() => remove(i)}
              style={{ ...btn('danger'), padding: '6px 10px' }}
              title="Eliminar ítem"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={add} style={btn('ghost')}>
          + Agregar ítem
        </button>

        <div style={{ flex: 1 }} />

        {message && (
          <p
            style={{
              fontSize: 13,
              color: message.type === 'success' ? '#2a6b3a' : '#b00020',
              margin: 0,
            }}
          >
            {message.type === 'success' ? '✓ ' : '✗ '}
            {message.text}
          </p>
        )}

        <button onClick={save} disabled={isPending} style={btn('primary')}>
          {isPending ? 'Guardando…' : 'GUARDAR CAMBIOS'}
        </button>
      </div>
    </div>
  );
}
