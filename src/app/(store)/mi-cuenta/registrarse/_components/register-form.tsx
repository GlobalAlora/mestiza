'use client';

import { registerAction } from '../actions';

export function RegisterForm() {
  return (
    <form action={registerAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-ink mb-1 block text-sm font-medium">Nombre</label>
          <input
            name="firstName"
            autoComplete="given-name"
            className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="text-ink mb-1 block text-sm font-medium">Apellido</label>
          <input
            name="lastName"
            autoComplete="family-name"
            className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
          />
        </div>
      </div>
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
          minLength={8}
          autoComplete="new-password"
          className="border-border focus:ring-primary w-full border px-3 py-2.5 text-sm outline-none focus:ring-2"
        />
        <p className="text-muted mt-1 text-xs">Mínimo 8 caracteres</p>
      </div>
      <button
        type="submit"
        className="bg-primary text-surface w-full py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
      >
        Crear cuenta
      </button>
    </form>
  );
}
