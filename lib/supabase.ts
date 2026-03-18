import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Announcement = {
  id: string
  title: string | null
  content: string
  phone: string | null
  created_at: string
}

export type Soldier = {
  id: string
  full_name: string
  phone: string
  profession: string
  category: string[]
  company_name: string | null
  description: string | null
  is_available: boolean
  platoon: string | null
  created_at: string
  updated_at: string
}
