export const siteConfig = {
  name: 'Soy Mestiza',
  tagline: 'Vinos de altura del corazón de Cuyo.',
  description:
    'Vinos de altura de Calingasta, San Juan. Nacidos del universo flamenco, árabe y folclórico de la obra ganadora del Carlos de Oro "Como el vino, Soy Mestiza".',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soymestiza.com',
  social: {
    instagram: 'https://instagram.com/soymestiza',
  },
  contact: {
    email: 'hola@soymestiza.com',
  },
  legal: {
    minAge: 18,
    alcoholWarning: 'Beber con moderación. Prohibida su venta a menores de 18 años.',
    drinkResponsibly: 'Bebé con moderación.',
  },
  brand: {
    origin: 'Calingasta, San Juan, Argentina',
    winery: 'Mendoza, Argentina',
    altitudeMeters: 1400,
    award: 'Carlos de Oro · Villa Carlos Paz',
  },
} as const;
