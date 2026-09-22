import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

export type Category = Database['public']['Tables']['categories']['Row'];

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').order('position');

  if (error) throw new Error(`getCategories: ${error.message}`);
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`getCategoryBySlug: ${error.message}`);
  }
  return data ?? null;
}
