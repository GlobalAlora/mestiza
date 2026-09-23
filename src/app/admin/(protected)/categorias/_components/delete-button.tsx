'use client';

import { deleteCategory } from '../actions';

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
        await deleteCategory(id);
      }}
      className="text-error text-xs hover:underline"
    >
      Eliminar
    </button>
  );
}
