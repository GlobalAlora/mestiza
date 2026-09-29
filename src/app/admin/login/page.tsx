'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf9f7',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          padding: 32,
          background: '#fff',
          border: '1px solid #e5e1db',
        }}
      >
        <h1
          style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 8 }}
        >
          Soy Mestiza
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Panel de administración</p>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', letterSpacing: '0.05em' }}>
            CONTRASEÑA
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            style={{
              border: '1px solid #ccc',
              padding: '8px 12px',
              fontSize: 14,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {state?.error && (
            <p style={{ fontSize: 13, color: '#b00020', margin: 0 }}>{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: 8,
              padding: '10px 16px',
              background: '#3d1a14',
              color: '#fff',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: pending ? 'wait' : 'pointer',
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? 'Verificando…' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
