'use client';

import { useRouter } from 'next/navigation';
import { deleteShippingMethod } from '../actions';

export function DeleteShippingButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`¿Eliminar el método "${name}"?`)) return;
        await deleteShippingMethod(id);
        router.refresh();
      }}
      className="text-error text-xs hover:underline"
    >
      Eliminar
    </button>
  );
}
