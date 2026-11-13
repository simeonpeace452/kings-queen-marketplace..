import { createClient } from "@supabase/supabase-js";

// Add your Supabase Project URL and Publishable/Anon key to a .env file.
// Never put a Supabase service-role key in a website.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
