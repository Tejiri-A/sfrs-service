import { createClient } from "@supabase/supabase-js";

const projectUrl = import.meta.env.VITE_SUPABASE_URL;
const projectAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!projectUrl || !projectAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(projectUrl, projectAnonKey);
