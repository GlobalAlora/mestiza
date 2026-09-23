'use client';

import { loginAction } from '../actions';

type Props = { next?: string };

export function LoginForm({ next }: Props) {
  return (
    <form action={loginAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label className="text-ink mb-1 block text-sm font-medium">Email *</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
        />
      </div>
      <div>
        <label className="text-ink mb-1 block text-sm font-medium">Contraseña *</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
        />
      </div>
      <div className="flex justify-end">
        <a
          href="/mi-cuenta/olvide-contrasena"
          className="text-muted hover:text-primary text-xs transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <button
        type="submit"
        className="bg-primary text-surface w-full py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
      >
        Ingresar
      </button>
    </form>
  );
}
