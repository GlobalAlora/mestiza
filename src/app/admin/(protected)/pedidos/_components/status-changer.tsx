'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';
import type { Enums } from '@/lib/supabase/types';

const statuses: { value: Enums<'order_status'>; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'preparing', label: 'En preparación' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'ready_for_pickup', label: 'Listo para retiro' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function StatusChanger({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: Enums<'order_status'>;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === currentStatus && !notes) return;
    setPending(true);
    await updateOrderStatus(orderId, status, notes);
    setSaved(true);
    setPending(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-ink mb-4 font-semibold">Cambiar estado</h2>

      <div className="space-y-3">
        <div>
          <label className="text-ink mb-1 block text-sm font-medium">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Enums<'order_status'>)}
            className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-ink mb-1 block text-sm font-medium">Nota interna (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="border-border text-ink focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            placeholder="Número de seguimiento, observaciones…"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-surface px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? 'Guardando…' : 'Actualizar'}
        </button>
        {saved && <span className="text-success text-sm">¡Guardado!</span>}
      </div>
    </form>
  );
}
