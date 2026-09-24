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
              <p className="text-muted mb-3 font-serif text-sm italic">{section.label}</p>
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

        <div className="mt-4 flex justify-center">
          <a
            href="https://globalalora.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            Desarrollado con
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path
                fill="#78B159"
                d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959.17-.721.268-1.469.268-2.242z"
              />
            </svg>
            por Global Alora
          </a>
        </div>
      </div>
    </footer>
  );
}
