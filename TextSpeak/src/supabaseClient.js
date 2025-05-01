// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl) // Temporary log
console.log('Supabase Anon Key:', supabaseAnonKey) // Temporary log

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)