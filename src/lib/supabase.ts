import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please add it to your .env file.')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please add it to your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category: string
  type: 'income' | 'expense'
  user_id: string
  created_at: string
}

export interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  user_id: string
  created_at: string
  completed_at?: string
}

export interface Challenge {
  id: string
  description: string
  status: 'pending' | 'accepted' | 'completed'
  week: string
  user_id: string
  created_at: string
  completed_at?: string
}