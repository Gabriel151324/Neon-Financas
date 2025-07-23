import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Transaction {
  id?: string
  description: string
  amount: number
  date: string
  category: string
  type: 'income' | 'expense'
  user_id?: string
  created_at?: string
}

export interface Goal {
  id?: string
  name: string
  target_amount: number
  current_amount: number
  deadline?: string
  user_id?: string
  created_at?: string
  completed_at?: string
}

export interface Challenge {
  id?: string
  description: string
  status: 'pending' | 'completed'
  user_id?: string
  created_at?: string
}