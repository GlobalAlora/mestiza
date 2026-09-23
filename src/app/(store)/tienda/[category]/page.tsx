import { redirect } from 'next/navigation';
import { getCategoryBySlug } from '@/features/catalog/queries/get-categories';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ category: string }> };

export default async function CategoryRedirectPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  redirect(`/tienda?categoria=${slug}`);
}
