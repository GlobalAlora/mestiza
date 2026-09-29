import { headers } from 'next/headers';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // Login page has its own full-page design — no admin chrome needed.
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: 'system-ui, sans-serif' }}>
      <nav
        style={{
          borderBottom: '1px solid #e5e1db',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>Admin — Soy Mestiza</span>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/admin/nav" style={{ fontSize: 13, color: '#555' }}>
            Menú de navegación
          </Link>
          <Link href="/" style={{ fontSize: 13, color: '#555' }}>
            Ver sitio
          </Link>
        </div>
      </nav>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>{children}</main>
    </div>
  );
}
