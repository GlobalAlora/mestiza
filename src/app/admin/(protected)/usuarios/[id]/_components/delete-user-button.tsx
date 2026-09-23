'use client';

import { deleteUserAction } from '../../actions';

export function DeleteUserButton({ id }: { id: string }) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
      >
        Eliminar usuario
      </button>
    </form>
  );
}
