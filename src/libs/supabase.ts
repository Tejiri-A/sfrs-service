import { createClient } from "@supabase/supabase-js";
const projectUrl = import.meta.env.VITE_SUPABASE_URL;
const projectAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(projectUrl, projectAnonKey);
