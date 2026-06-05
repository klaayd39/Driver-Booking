import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://raylkxunuhjusxwandle.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_dLxkWcGIyDS-ti0uSAuU1g_VmdU0n3q'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)