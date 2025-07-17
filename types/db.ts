import { Database } from './supabase';

export type Poll = Database['public']['Tables']['polls']['Row'] & { votes?: Vote[] };
export type Vote = Database['public']['Tables']['votes']['Row'];