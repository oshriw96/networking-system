import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    has_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    has_admin_password: !!process.env.ADMIN_PASSWORD,
    service_role_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  })
}
