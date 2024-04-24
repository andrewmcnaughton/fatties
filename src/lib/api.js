import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
    'https://aktjwoonwpdssbkjerge.supabase.co',
    import.meta.env.VITE_SUPABASETOKEN
);
