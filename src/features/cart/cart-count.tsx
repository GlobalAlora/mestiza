'use client';

import { useCartStore } from './store';

export function CartCount() {
  const count = useCartStore((s) => s.itemCount());

  if (count === 0) return null;

  return (
    <span
      className="bg-primary text-surface absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums"
      aria-label={`${count} ${count === 1 ? 'producto' : 'productos'} en el carrito`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}
