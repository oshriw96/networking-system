import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()

  if (!phone) return NextResponse.json({ error: 'מספר טלפון חסר' }, { status: 400 })

  const { data, error } = await supabase
    .from('soldiers')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'מספר טלפון לא נמצא במערכת' }, { status: 404 })
  }

  return NextResponse.json(data)
}
