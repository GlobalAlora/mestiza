import Link from 'next/link';
import { createShippingMethod } from '../actions';
import { ShippingForm } from '../_components/shipping-form';

export const metadata = { title: 'Nuevo método de envío' };

export default function NewShippingPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/envios" className="text-muted hover:text-ink text-sm">
          ← Envíos
        </Link>
        <h1 className="text-ink mt-1 text-2xl font-semibold">Nuevo método de envío</h1>
      </div>
      <ShippingForm action={createShippingMethod} submitLabel="Crear método" />
    </div>
  );
}
