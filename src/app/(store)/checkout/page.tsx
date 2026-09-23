import { getActiveShippingMethods } from '@/features/checkout/queries';
import { CheckoutForm } from './_components/checkout-form';

export const metadata = { title: 'Checkout — Soy Mestiza' };

export default async function CheckoutPage() {
  const shippingMethods = await getActiveShippingMethods();

  return (
    <main className="px-4 pb-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-ink mt-8 mb-6 text-2xl font-semibold">Checkout</h1>
        <CheckoutForm shippingMethods={shippingMethods} />
      </div>
    </main>
  );
}
