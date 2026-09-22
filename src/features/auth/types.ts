// Fase 1-5: Supabase Auth, roles

export type UserRole = 'customer' | 'admin';

export type Profile = {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};
