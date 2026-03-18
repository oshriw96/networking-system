import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const adminPassword = req.headers.get('x-admin-password')

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('soldiers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = ['שם מלא', 'טלפון', 'מקצוע', 'קטגוריה', 'פלוגה', 'חברה', 'תיאור', 'זמין לעזור', 'תאריך הצטרפות']

  const rows = (data || []).map(s => [
    s.full_name,
    s.phone,
    s.profession,
    Array.isArray(s.category) ? s.category.join(', ') : s.category,
    s.platoon || '',
    s.company_name || '',
    s.description || '',
    s.is_available ? 'כן' : 'לא',
    new Date(s.created_at).toLocaleDateString('he-IL'),
  ])

  const csvRows = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  )

  const csv = '\uFEFF' + csvRows.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="gidud-tzuri-network.csv"',
    },
  })
}
