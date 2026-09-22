// Fase 4: Zustand store en store.ts, persistencia en localStorage

export type CartItem = {
  variantId: string;
  productId: string;
  name: string;
  variantName: string;
  sku: string;
  price: number; // centavos ARS
  quantity: number;
  imagePath: string | null;
  slug: string;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  itemCount: () => number;
};
