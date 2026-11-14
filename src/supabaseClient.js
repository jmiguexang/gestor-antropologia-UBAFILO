import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iulnsfsawlmqherjprwx.supabase.co'
const supabaseAnonKey = 'sb_publishable_olBKcFyKpsNfgxd9rG0-Rg_WIJgskMe'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
