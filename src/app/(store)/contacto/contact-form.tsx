'use client';

import { useActionState } from 'react';
import { submitContact, type ContactFormState } from './actions';
import { esAR } from '@/i18n/es-AR';

const initial: ContactFormState = { status: 'idle' };

type Props = { content: Record<string, string> };

export function ContactForm({ content }: Props) {
  const t2 = (key: string, fb: string) => content[key]?.trim() || fb;
  const [state, action, pending] = useActionState(submitContact, initial);
  const t = esAR.contact;

  if (state.status === 'success') {
    return (
      <div className="border-success/30 bg-success/5 rounded-sm border p-8 text-center">
        <p className="text-primary font-serif text-2xl">{t.successTitle}</p>
        <p className="text-muted mt-3 text-sm">{t.successText}</p>
      </div>
    );
  }

  const errors = state.status === 'error' ? state.errors : {};

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-muted text-xs font-semibold tracking-[0.15em] uppercase"
        >
          {t2('contacto.field_nombre', 'Nombre')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="border-border text-ink placeholder:text-muted focus:border-primary border bg-transparent px-4 py-3 text-sm focus:outline-none"
          placeholder={t.namePlaceholder}
        />
        {errors.name && (
          <p id="name-error" className="text-error text-xs" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-muted text-xs font-semibold tracking-[0.15em] uppercase"
        >
          {t2('contacto.field_email', 'Email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="border-border text-ink placeholder:text-muted focus:border-primary border bg-transparent px-4 py-3 text-sm focus:outline-none"
          placeholder={t.emailPlaceholder}
        />
        {errors.email && (
          <p id="email-error" className="text-error text-xs" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-muted text-xs font-semibold tracking-[0.15em] uppercase"
        >
          {t2('contacto.field_mensaje', 'Mensaje')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="border-border text-ink placeholder:text-muted focus:border-primary resize-none border bg-transparent px-4 py-3 text-sm focus:outline-none"
          placeholder={t.messagePlaceholder}
        />
        {errors.message && (
          <p id="message-error" className="text-error text-xs" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-error text-xs" role="alert">
          {t.errorText}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-surface px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity enabled:hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
