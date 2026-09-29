import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/features/cart/cart-drawer';
import { getContentMap, c } from '@/lib/content';
import { mainNav } from '@/config/navigation';

type NavItem = { href: string; label: string };

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const content = await getContentMap();
  const navJson = c(content, 'nav.main_items', '');

  let navItems: NavItem[] | undefined;
  if (navJson) {
    try {
      navItems = JSON.parse(navJson) as NavItem[];
    } catch {
      navItems = undefined;
    }
  }

  return (
    <>
      <Header navItems={navItems ?? mainNav} />
      <main id="main-content">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
