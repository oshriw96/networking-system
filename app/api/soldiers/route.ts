import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let query = supabase.from('soldiers').select('*').order('created_at', { ascending: false })

  if (category && category !== 'הכל') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,profession.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { full_name, phone, profession, category, company_name, description, platoon } = body

  if (!full_name || !phone || !profession || !category) {
    return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('soldiers')
    .select('id')
    .eq('phone', phone)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'מספר טלפון כבר קיים במערכת' }, { status: 409 })
  }

  const { data, error } = await supabase.from('soldiers').insert({
    full_name,
    phone,
    profession,
    category,
    company_name: company_name || null,
    description: description || null,
    platoon: platoon || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
