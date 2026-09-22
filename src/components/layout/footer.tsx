import Link from 'next/link';
import { footerNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-border bg-surface border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-primary font-serif text-lg">{siteConfig.name}</p>
            <p className="text-muted mt-2 text-sm">{siteConfig.tagline}</p>
            <p className="text-muted mt-4 text-xs">{siteConfig.brand.origin}</p>
          </div>
          {footerNav.map((section) => (
            <div key={section.label}>
              <p className="text-muted mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                {section.label}
              </p>
              <ul className="space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-10 flex flex-col items-center gap-3 border-t pt-6 md:flex-row md:justify-between">
          {/* Legal alcohol notice — Ley 24.788 */}
          <p className="text-muted text-center text-xs font-medium md:text-left">
            {siteConfig.legal.alcoholWarning}
          </p>
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
