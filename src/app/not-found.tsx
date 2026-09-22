import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-muted mb-4 text-xs font-semibold tracking-[0.3em] uppercase">404</p>
      <h1 className="text-primary font-serif text-4xl">Página no encontrada</h1>
      <p className="text-muted mt-4">La página que buscás no existe o fue movida.</p>
      <Link
        href="/"
        className="text-primary mt-8 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
