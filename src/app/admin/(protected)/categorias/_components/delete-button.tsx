'use client';

import { useRouter } from 'next/navigation';
import { deleteCategory } from '../actions';

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
        await deleteCategory(id);
        router.refresh();
      }}
      className="text-error text-xs hover:underline"
    >
      Eliminar
    </button>
  );
}
