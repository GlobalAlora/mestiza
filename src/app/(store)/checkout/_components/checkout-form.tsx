'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useCartStore } from '@/features/cart/store';
import { createOrder } from '@/features/checkout/actions';
import type { ActiveShippingMethod } from '@/features/checkout/queries';
import type { CreateOrderInput } from '@/features/checkout/actions';

type Props = {
  shippingMethods: ActiveShippingMethod[];
  content: Record<string, string>;
};

type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AddressData = {
  street: string;
  number: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
};

type Step = 'contact' | 'shipping' | 'review';

function formatCents(cents: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cents / 100);
}

export function CheckoutForm({ shippingMethods, content }: Props) {
  const ct = (key: string, fb: string) => content[key]?.trim() || fb;
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const [step, setStep] = useState<Step>('contact');
  const [contact, setContact] = useState<ContactData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [selectedMethodId, setSelectedMethodId] = useState<string>(shippingMethods[0]?.id ?? '');
  const [address, setAddress] = useState<AddressData>({
    street: '',
    number: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [notes, setNotes] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedMethod = shippingMethods.find((m) => m.id === selectedMethodId);
  const isDelivery = selectedMethod?.type === 'delivery';

  const subtotalCents = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const shippingCents = (() => {
    if (!selectedMethod) return 0;
    if (selectedMethod.type !== 'delivery') return 0;
    const zone = selectedMethod.zones?.[0];
    if (!zone) return 0;
    if (zone.free_from_cents != null && subtotalCents >= zone.free_from_cents) return 0;
    return zone.base_rate_cents;
  })();

  const totalCents = subtotalCents + shippingCents;

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setContact({
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
    });
    setStep('shipping');
  }

  function handleShippingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isDelivery) {
      const fd = new FormData(e.currentTarget);
      setAddress({
        street: fd.get('street') as string,
        number: fd.get('number') as string,
        apartment: (fd.get('apartment') as string) || '',
        city: fd.get('city') as string,
        province: fd.get('province') as string,
        postalCode: fd.get('postalCode') as string,
      });
    }
    setStep('review');
  }

  function handleConfirm() {
    if (!ageVerified) return;
    setServerError(null);

    const input: CreateOrderInput = {
      contact,
      shippingMethodId: selectedMethodId,
      address: isDelivery
        ? {
            street: address.street,
            number: address.number,
            apartment: address.apartment || undefined,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode,
          }
        : undefined,
      notes: notes || undefined,
      ageVerified: true,
      items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    };

    startTransition(async () => {
      const result = await createOrder(input);
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      clear();
      if (result.initPoint) {
        // External MP URL — must use window.location for external redirects
        window.location.assign(result.initPoint);
      } else {
        router.push(`/checkout/confirmacion?access_token=${result.accessToken}`);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted text-sm">{ct('checkout.empty_cart', 'Tu carrito está vacío.')}</p>
        <Link href="/tienda" className="text-primary mt-3 inline-block text-sm underline">
          {ct('checkout.empty_cart_cta', 'Ver productos')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Steps indicator */}
      <div className="mb-8 flex items-center gap-2 text-xs font-medium">
        {(['contact', 'shipping', 'review'] as const).map((s, idx) => {
          const labels = [
            ct('checkout.step_contact', 'Datos'),
            ct('checkout.step_shipping', 'Envío'),
            ct('checkout.step_review', 'Revisión'),
          ];
          const active = s === step;
          const done =
            (s === 'contact' && (step === 'shipping' || step === 'review')) ||
            (s === 'shipping' && step === 'review');
          return (
            <span key={s} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? 'bg-primary text-surface'
                    : done
                      ? 'bg-success text-white'
                      : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                {done ? '✓' : idx + 1}
              </span>
              <span className={active ? 'text-ink' : 'text-muted'}>{labels[idx]}</span>
              {idx < 2 && <span className="text-border">—</span>}
            </span>
          );
        })}
      </div>

      {/* Step 1: Contact */}
      {step === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-5">
          <h2 className="text-ink text-lg font-semibold">
            {ct('checkout.contact_title', 'Datos de contacto')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-ink mb-1 block text-sm font-medium">
                {ct('checkout.field_nombre', 'Nombre')} *
              </label>
              <input
                name="firstName"
                required
                defaultValue={contact.firstName}
                className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-medium">
                {ct('checkout.field_apellido', 'Apellido')} *
              </label>
              <input
                name="lastName"
                required
                defaultValue={contact.lastName}
                className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-medium">
                {ct('checkout.field_email', 'Email')} *
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={contact.email}
                className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm font-medium">
                {ct('checkout.field_telefono', 'Teléfono')} *
              </label>
              <input
                name="phone"
                type="tel"
                required
                defaultValue={contact.phone}
                placeholder="+54 9 11 1234 5678"
                className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-surface w-full py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
          >
            {ct('checkout.btn_continue', 'Continuar')}
          </button>
        </form>
      )}

      {/* Step 2: Shipping */}
      {step === 'shipping' && (
        <form onSubmit={handleShippingSubmit} className="space-y-5">
          <h2 className="text-ink text-lg font-semibold">
            {ct('checkout.shipping_title', 'Método de envío')}
          </h2>

          {shippingMethods.length === 0 ? (
            <p className="text-muted text-sm">
              {ct('checkout.no_shipping_methods', 'No hay métodos de envío disponibles.')}
            </p>
          ) : (
            <div className="space-y-3">
              {shippingMethods.map((m) => {
                const zone = m.zones?.[0];
                const isFree =
                  m.type !== 'delivery' ||
                  (zone?.free_from_cents != null && subtotalCents >= zone.free_from_cents);
                const cost = isFree ? 0 : (zone?.base_rate_cents ?? 0);
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 border p-4 transition-colors ${
                      selectedMethodId === m.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={m.id}
                      checked={selectedMethodId === m.id}
                      onChange={() => setSelectedMethodId(m.id)}
                      className="accent-primary"
                    />
                    <div className="flex-1">
                      <p className="text-ink text-sm font-medium">{m.name}</p>
                    </div>
                    <p className="text-ink text-sm font-semibold">
                      {cost === 0 ? ct('checkout.shipping_free', 'Gratis') : formatCents(cost)}
                    </p>
                  </label>
                );
              })}
            </div>
          )}

          {isDelivery && (
            <div className="space-y-4">
              <h3 className="text-ink text-sm font-semibold">
                {ct('checkout.address_title', 'Dirección de entrega')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_calle', 'Calle')} *
                  </label>
                  <input
                    name="street"
                    required
                    defaultValue={address.street}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_numero', 'Número')} *
                  </label>
                  <input
                    name="number"
                    required
                    defaultValue={address.number}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_piso', 'Piso / Dpto')}
                  </label>
                  <input
                    name="apartment"
                    defaultValue={address.apartment}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_ciudad', 'Ciudad')} *
                  </label>
                  <input
                    name="city"
                    required
                    defaultValue={address.city}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_provincia', 'Provincia')} *
                  </label>
                  <input
                    name="province"
                    required
                    defaultValue={address.province}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="text-ink mb-1 block text-sm font-medium">
                    {ct('checkout.field_cp', 'Código postal')} *
                  </label>
                  <input
                    name="postalCode"
                    required
                    defaultValue={address.postalCode}
                    className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-ink mb-1 block text-sm font-medium">
              {ct('checkout.field_notas', 'Notas de envío (opcional)')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Referencias, instrucciones especiales…"
              className="border-border focus:ring-primary w-full border px-3 py-2 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('contact')}
              className="border-border text-ink rounded border px-5 py-3 text-sm transition-colors hover:bg-zinc-50"
            >
              {ct('checkout.btn_back', 'Atrás')}
            </button>
            <button
              type="submit"
              className="bg-primary text-surface flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
            >
              {ct('checkout.btn_continue', 'Continuar')}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <div className="space-y-6">
          <h2 className="text-ink text-lg font-semibold">
            {ct('checkout.review_title', 'Revisión del pedido')}
          </h2>

          {/* Order items */}
          <div className="divide-border divide-y rounded border">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate text-sm font-medium">{item.name}</p>
                  <p className="text-muted text-xs">{item.variantName}</p>
                </div>
                <p className="text-muted text-sm">×{item.quantity}</p>
                <p className="text-ink text-sm font-semibold">
                  {formatCents(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-border space-y-2 rounded border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{ct('checkout.subtotal_label', 'Subtotal')}</span>
              <span className="text-ink">{formatCents(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                {ct('checkout.shipping_label', 'Envío')} ({selectedMethod?.name ?? '—'})
              </span>
              <span className="text-ink">
                {shippingCents === 0
                  ? ct('checkout.shipping_free', 'Gratis')
                  : formatCents(shippingCents)}
              </span>
            </div>
            <div className="border-border flex justify-between border-t pt-2 font-semibold">
              <span className="text-ink">{ct('checkout.total_label', 'Total')}</span>
              <span className="text-primary">{formatCents(totalCents)}</span>
            </div>
          </div>

          {/* Contact summary */}
          <div className="text-muted space-y-1 text-sm">
            <p>
              <strong className="text-ink">
                {ct('checkout.review_contact_label', 'Contacto')}:
              </strong>{' '}
              {contact.firstName} {contact.lastName} · {contact.email} · {contact.phone}
            </p>
            {isDelivery && address.street && (
              <p>
                <strong className="text-ink">
                  {ct('checkout.review_address_label', 'Dirección')}:
                </strong>{' '}
                {address.street} {address.number}
                {address.apartment ? `, ${address.apartment}` : ''}, {address.city},{' '}
                {address.province} ({address.postalCode})
              </p>
            )}
            {!isDelivery && selectedMethod && (
              <p>
                <strong className="text-ink">
                  {ct('checkout.review_pickup_label', 'Retiro')}:
                </strong>{' '}
                {selectedMethod.name}
              </p>
            )}
          </div>

          {/* Age verification */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={ageVerified}
              onChange={(e) => setAgeVerified(e.target.checked)}
              className="accent-primary mt-0.5"
            />
            <span className="text-ink text-sm">
              {ct(
                'checkout.age_verification',
                'Declaro que soy mayor de 18 años. El consumo de alcohol en exceso es perjudicial para la salud.',
              )}
            </span>
          </label>

          {serverError && (
            <p className="text-error rounded bg-red-50 px-3 py-2 text-sm">{serverError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="border-border text-ink rounded border px-5 py-3 text-sm transition-colors hover:bg-zinc-50"
              disabled={isPending}
            >
              {ct('checkout.btn_back', 'Atrás')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!ageVerified || isPending}
              className="bg-primary text-surface flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {isPending
                ? ct('checkout.btn_processing', 'Procesando…')
                : ct('checkout.btn_confirm', 'Confirmar y pagar')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
