import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, content, phone } = body

  if (!content || content.trim() === '') {
    return NextResponse.json({ error: 'תוכן ההודעה הוא שדה חובה' }, { status: 400 })
  }

  const { data, error } = await supabase.from('announcements').insert({
    title: title?.trim() || null,
    content: content.trim(),
    phone: phone?.trim() || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
