import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('VITE_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
}

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