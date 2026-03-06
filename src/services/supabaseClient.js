/**
 * supabaseClient.js
 * Inicializa y exporta el cliente de Supabase.
 * Las variables de entorno se configuran en el archivo .env
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Faltan variables de entorno de Supabase. Revisa tu archivo .env: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
