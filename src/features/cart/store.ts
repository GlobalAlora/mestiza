'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState } from './types';

type CartStore = CartState & {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i,
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], isOpen: true });
        }
      },

      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        });
      },

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'sm-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
