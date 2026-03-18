import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

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

  const rows = (data || []).map((s) => ({
    'שם מלא': s.full_name,
    'טלפון': s.phone,
    'מקצוע': s.profession,
    'קטגוריה': s.category,
    'פלוגה': s.platoon || '',
    'חברה': s.company_name || '',
    'תיאור': s.description || '',
    'זמין לעזור': s.is_available ? 'כן' : 'לא',
    'תאריך הצטרפות': new Date(s.created_at).toLocaleDateString('he-IL'),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'חיילים')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="gidud-tzuri-network.xlsx"',
    },
  })
}
