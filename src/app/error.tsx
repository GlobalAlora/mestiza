'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-muted mb-4 text-xs font-semibold tracking-[0.3em] uppercase">Error</p>
      <h1 className="text-primary font-serif text-4xl">Algo salió mal</h1>
      <p className="text-muted mt-4">Ocurrió un error inesperado. Por favor, intentá nuevamente.</p>
      <button
        onClick={reset}
        className="text-primary mt-8 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        Reintentar
      </button>
    </main>
  );
}
