import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return handleCorsOptions(origin);
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders })
    }

    const today = new Date()
    const y = today.getFullYear()
    const m = today.getMonth()
    const start = new Date(y, m, 1)
    const end = new Date(y, m + 1, 0)
    try {
      const current = await (prisma as any).invoice.findFirst({
        where: { userId, periodStart: start, periodEnd: end },
      })
      const isLocked = today.getDate() >= 2 && (!current || current.status !== 'PAID')
      return NextResponse.json({ success: true, locked: isLocked }, { headers: corsHeaders })
    } catch {
      const companiesCount = await prisma.company.count({ where: { userId, isActive: true } })
      const isLocked = today.getDate() >= 2 && companiesCount > 0
      return NextResponse.json({ success: true, locked: isLocked }, { headers: corsHeaders })
    }
  } catch (error) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Failed to get billing status' }, { status: 500, headers: corsHeaders })
  }
}
