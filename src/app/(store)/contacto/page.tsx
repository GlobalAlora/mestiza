import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { ContactForm } from './contact-form';

export const metadata: Metadata = buildMetadata({
  title: `Contacto | ${siteConfig.name}`,
  description:
    'Ponete en contacto con el equipo de Soy Mestiza. Respondemos todas las consultas sobre nuestros vinos y envíos.',
  path: '/contacto',
});

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <header className="mb-12 text-center">
        <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">
          {siteConfig.name}
        </p>
        <h1 className="text-primary font-serif text-4xl">Contacto</h1>
        <p className="text-muted mt-4">Escribinos, con gusto te respondemos.</p>
      </header>

      <ContactForm />

      <div className="border-border mt-12 border-t pt-8 text-center">
        <p className="text-muted text-sm">
          También podés escribirnos a{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-ink hover:text-primary font-medium underline underline-offset-4 transition-colors"
          >
            {siteConfig.contact.email}
          </a>
        </p>
      </div>
    </div>
  );
}
