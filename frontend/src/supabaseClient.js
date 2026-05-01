import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etvuntlaacvoyjspzqre.supabase.co';
const supabaseKey = 'sb_publishable_aFLIXzIDRfN9dS7ttfuKlw_ShzzXIdf';

export const supabase = createClient(supabaseUrl, supabaseKey);
