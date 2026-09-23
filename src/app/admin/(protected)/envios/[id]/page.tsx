import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateShippingMethod } from '../actions';
import { ShippingForm } from '../_components/shipping-form';

export const metadata = { title: 'Editar método de envío' };

export default async function EditShippingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: method } = await db.from('shipping_methods').select('*').eq('id', id).single();

  if (!method) notFound();

  const updateWithId = updateShippingMethod.bind(null, id);
  const zones = Array.isArray(method.zones)
    ? (method.zones as Array<{ name: string; price_cents: number }>)
    : [];

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/envios" className="text-muted hover:text-ink text-sm">
          ← Envíos
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">{method.name}</h1>
      </div>
      <ShippingForm
        action={updateWithId}
        defaultValues={{
          name: method.name,
          type: method.type,
          is_active: method.is_active,
          position: method.position,
          zones,
        }}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
