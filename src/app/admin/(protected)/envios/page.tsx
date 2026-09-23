import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { DeleteShippingButton } from './_components/delete-button';

export const metadata = { title: 'Métodos de envío' };

const typeLabel: Record<string, string> = {
  delivery: 'Envío a domicilio',
  pickup: 'Retiro en local',
  theater_pickup: 'Retiro en teatro',
};

export default async function ShippingPage() {
  const db = createAdminClient();
  const { data: methods } = await db
    .from('shipping_methods')
    .select('id, name, type, is_active, position, zones')
    .order('position');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-ink text-2xl font-semibold">Métodos de envío</h1>
        <Link
          href="/admin/envios/nueva"
          className="bg-primary text-surface px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-85"
        >
          + Nuevo método
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {!methods || methods.length === 0 ? (
          <p className="text-muted px-6 py-10 text-center text-sm">
            No hay métodos de envío.{' '}
            <Link href="/admin/envios/nueva" className="text-primary hover:underline">
              Crear el primero
            </Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-muted px-6 py-3 text-left font-medium">Nombre</th>
                <th className="text-muted px-6 py-3 text-left font-medium">Tipo</th>
                <th className="text-muted px-6 py-3 text-left font-medium">Zonas</th>
                <th className="text-muted px-6 py-3 text-left font-medium">Estado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {methods.map((m) => {
                const zones = Array.isArray(m.zones) ? m.zones.length : 0;
                return (
                  <tr key={m.id} className="hover:bg-zinc-50">
                    <td className="text-ink px-6 py-3 font-medium">{m.name}</td>
                    <td className="text-muted px-6 py-3">{typeLabel[m.type] ?? m.type}</td>
                    <td className="text-muted px-6 py-3">{zones > 0 ? `${zones} zonas` : '—'}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-600'}`}
                      >
                        {m.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/envios/${m.id}`}
                        className="text-primary mr-3 text-xs hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteShippingButton id={m.id} name={m.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
