'use client';

import { deleteProduct } from '../actions';

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        await deleteProduct(id);
      }}
      className="text-error text-xs hover:underline"
    >
      Eliminar
    </button>
  );
}
