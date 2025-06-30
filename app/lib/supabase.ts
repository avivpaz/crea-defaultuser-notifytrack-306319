import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Since we're only using server-side operations, we only need the admin client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Export the URL and anon key in case needed for client-side operations in the future
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
} as const; 