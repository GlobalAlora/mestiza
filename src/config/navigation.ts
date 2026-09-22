export const mainNav = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/historia', label: 'Historia' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export const accountNav = [
  { href: '/mi-cuenta', label: 'Mi cuenta' },
  { href: '/mi-cuenta/pedidos', label: 'Mis pedidos' },
] as const;

export const footerNav = [
  {
    label: 'Legal',
    links: [
      { href: '/legal/terminos', label: 'Términos y condiciones' },
      { href: '/legal/privacidad', label: 'Política de privacidad' },
      { href: '/legal/envios', label: 'Envíos y devoluciones' },
      { href: '/legal/arrepentimiento', label: 'Botón de arrepentimiento' },
    ],
  },
  {
    label: 'Ayuda',
    links: [
      { href: '/mi-cuenta/pedidos', label: 'Seguir un pedido' },
      { href: '/contacto', label: 'Contacto' },
      { href: '/tienda', label: 'Tienda' },
    ],
  },
] as const;

export type NavLink = { href: string; label: string };
