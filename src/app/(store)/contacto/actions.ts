'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre').max(100),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje es muy corto').max(2000),
});

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors: Partial<Record<'name' | 'email' | 'message' | 'root', string>> };

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: 'error',
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }

  // TODO Fase 4: enviar email via Resend
  // const resend = new Resend(env.RESEND_API_KEY);
  // await resend.emails.send({ from: '...', to: env.CONTACT_EMAIL, ... });

  console.log('[contact]', parsed.data);

  return { status: 'success' };
}
