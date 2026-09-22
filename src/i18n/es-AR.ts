/**
 * Diccionario de strings de UI en es-AR.
 * Para agregar inglés: crear en/en.ts con la misma estructura y activar next-intl.
 */
export const esAR = {
  ageGate: {
    title: 'Contenido para mayores de 18 años',
    description:
      'Este sitio contiene información sobre bebidas alcohólicas. ¿Confirmás que sos mayor de edad?',
    confirm: 'Soy mayor de 18 años',
    reject: 'No, soy menor de edad',
    legalNote: 'Beber con moderación. Prohibida su venta a menores de 18 años.',
  },
  cart: {
    title: 'Carrito',
    empty: 'Tu carrito está vacío',
    emptyDescription: 'Explorá nuestra tienda y encontrá tus vinos.',
    continueShopping: 'Ir a la tienda',
    items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
    subtotal: 'Subtotal',
    shipping: 'Envío',
    total: 'Total',
    checkout: 'Iniciar compra',
    remove: 'Eliminar',
    update: 'Actualizar',
  },
  checkout: {
    title: 'Checkout',
    steps: {
      contact: 'Datos de contacto',
      shipping: 'Entrega',
      payment: 'Pago',
    },
    ageVerification:
      'Confirmo que soy mayor de 18 años y acepto las condiciones de venta de bebidas alcohólicas.',
    guestCheckout: 'Continuar como invitado',
    loginPrompt: '¿Tenés cuenta?',
    login: 'Iniciar sesión',
    orderSummary: 'Resumen del pedido',
    placeOrder: 'Confirmar pedido',
    processingPayment: 'Procesando pago...',
  },
  orders: {
    title: 'Mis pedidos',
    empty: 'No tenés pedidos todavía',
    orderNumber: (n: string) => `Pedido ${n}`,
    statuses: {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'En preparación',
      shipped: 'Enviado',
      ready_for_pickup: 'Listo para retirar',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    },
  },
  errors: {
    generic: 'Algo salió mal. Por favor, intentá nuevamente.',
    notFound: 'No encontramos lo que buscás.',
    outOfStock: 'Sin stock disponible.',
    paymentFailed: 'El pago no pudo procesarse. Verificá tus datos e intentá de nuevo.',
  },
} as const;

export type Translations = typeof esAR;
