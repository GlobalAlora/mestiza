import { getContentMap, c } from '@/lib/content';
import { mainNav } from '@/config/navigation';
import { NavEditor } from './nav-editor';

export const metadata = { title: 'Menú de navegación' };

type NavItem = { label: string; href: string };

export default async function AdminNavPage() {
  const content = await getContentMap();
  const navJson = c(content, 'nav.main_items', '');

  let navItems: NavItem[] = mainNav.map((item) => ({ label: item.label, href: item.href }));
  if (navJson) {
    try {
      navItems = JSON.parse(navJson) as NavItem[];
    } catch {
      // fallback to static default
    }
  }

  return <NavEditor initialItems={navItems} />;
}
