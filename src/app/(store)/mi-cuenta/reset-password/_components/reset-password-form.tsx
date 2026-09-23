'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value;

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setError('');
    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace('/mi-cuenta?mensaje=contrasena-actualizada');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-error rounded bg-red-50 px-3 py-2 text-sm">{error}</p>}

      <div>
        <label className="text-ink mb-1 block text-sm font-medium">Nueva contraseña *</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
        />
        <p className="text-muted mt-1 text-xs">Mínimo 8 caracteres.</p>
      </div>

      <div>
        <label className="text-ink mb-1 block text-sm font-medium">Confirmar contraseña *</label>
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-surface w-full py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {isPending ? 'Guardando…' : 'Guardar contraseña'}
      </button>
    </form>
  );
}
