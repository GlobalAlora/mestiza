import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { getContentMap, c } from '@/lib/content';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: `Historia | ${siteConfig.name}`,
  description:
    'La historia detrás de Soy Mestiza: un vino nacido del escenario, del flamenco, la música árabe y el folclore de Argentina.',
  path: '/historia',
});

export default async function HistoriaPage() {
  const content = await getContentMap();
  const award = c(content, 'general.award', siteConfig.brand.award);
  const altitude = siteConfig.brand.altitudeMeters;

  const openingDefault = `Soy Mestiza es un vino de altura nacido del encuentro entre el escenario y la tierra. Una obra teatral que obtuvo el ${award} se convirtió en inspiración para una colección de vinos únicos del Valle de Calingasta, San Juan.`;
  const quoteDefault =
    'Flamenco, música árabe, folclore y tango fundidos en una sola voz. Como el vino: mestiza, libre, de raíz profunda.';
  const body1Default = `Los viñedos se ubican a más de ${altitude} metros sobre el nivel del mar en el Valle de Calingasta, uno de los valles vitivinícolas de mayor altitud de Argentina. El suelo pedregoso, el clima árido y la amplitud térmica dan lugar a vinos de personalidad marcada, con aromas intensos y taninos finos.`;
  const body2Default =
    'Cada botella de Soy Mestiza lleva consigo la identidad mestiza del proyecto: la mezcla de culturas, de suelos, de historias. Un vino que celebra el encuentro y la diversidad, igual que la obra que le da nombre.';
  const regionDefault = `Valle de Calingasta, San Juan, Argentina. Más de ${altitude} msnm, suelos pedregosos y clima continental. Una de las zonas vitivinícolas de mayor altitud del país, con amplitudes térmicas que concentran aromas y preservan la acidez natural de la uva.`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <header className="mb-14 text-center">
        <p className="text-muted mb-3 text-xs font-semibold tracking-[0.3em] uppercase">La obra</p>
        <h1 className="text-primary font-serif text-4xl md:text-5xl">
          {c(content, 'historia.title', 'Como el vino, Soy Mestiza')}
        </h1>
      </header>

      <div className="prose prose-neutral text-ink mx-auto space-y-8 text-base leading-relaxed">
        <p className="text-muted text-lg leading-relaxed">
          {c(content, 'historia.opening', openingDefault)}
        </p>

        <div className="border-primary/30 my-10 border-l-2 pl-6">
          <p className="text-primary/80 font-serif text-xl italic">
            &ldquo;{c(content, 'historia.quote', quoteDefault)}&rdquo;
          </p>
        </div>

        <p>{c(content, 'historia.body1', body1Default)}</p>

        <p>{c(content, 'historia.body2', body2Default)}</p>

        <div className="bg-primary/5 border-primary/15 my-8 rounded-sm border p-6">
          <p className="text-muted mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            La región
          </p>
          <p className="text-ink text-sm leading-relaxed">
            {c(content, 'historia.region_body', regionDefault)}
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Link
          href="/tienda"
          className="bg-primary text-surface inline-block px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85"
        >
          Conocé los vinos
        </Link>
        <Link
          href="/contacto"
          className="text-muted hover:text-ink text-sm font-medium underline underline-offset-4 transition-colors"
        >
          Contactanos
        </Link>
      </div>
    </div>
  );
}
