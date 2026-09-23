'use server';

import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { siteConfig } from '@/config/site';

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

  sendEmail({
    to: siteConfig.contact.email,
    subject: `Nuevo mensaje de contacto de ${parsed.data.name}`,
    html: `
      <p><strong>Nombre:</strong> ${parsed.data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${parsed.data.email}">${parsed.data.email}</a></p>
      <hr />
      <p>${parsed.data.message.replace(/\n/g, '<br>')}</p>
      <hr />
      <p style="color:#888;font-size:12px">Enviado desde el formulario de contacto de Soy Mestiza</p>
    `,
  }).catch(() => {});

  return { status: 'success' };
}
