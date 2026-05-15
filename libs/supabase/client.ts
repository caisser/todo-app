import { createBrowserClient } from '@supabase/ssr';
import { environment } from '@/libs/env';

export function createClient() {
  return createBrowserClient(environment.supabaseUrl, environment.supabaseAnonKey);
}
