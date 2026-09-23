import { getContentMap } from '@/lib/content';
import CartContent from './cart-content';

export const revalidate = 3600;

export default async function CartPage() {
  const content = await getContentMap();
  return <CartContent content={content} />;
}
