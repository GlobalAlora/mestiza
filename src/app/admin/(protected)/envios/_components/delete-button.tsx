'use client';

import { deleteShippingMethod } from '../actions';

export function DeleteShippingButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`¿Eliminar el método "${name}"?`)) return;
        await deleteShippingMethod(id);
      }}
      className="text-error text-xs hover:underline"
    >
      Eliminar
    </button>
  );
}
