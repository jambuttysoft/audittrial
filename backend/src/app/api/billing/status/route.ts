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
    const currentStart = new Date(y, m, 1)
    const currentEnd = new Date(y, m + 1, 0)
    const prevStart = new Date(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, 1)
    const prevEnd = new Date(m === 0 ? y - 1 : y, m === 0 ? 12 : m, 0)

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          autoChargeEnabled: true,
          stripeCustomerId: true,
          defaultPaymentMethodId: true,
        }
      }) as any

      const paidCount = await (prisma as any).invoice.count({ where: { userId, status: 'PAID' } })
      const isPostFactumEligible = !!user?.autoChargeEnabled && !!user?.stripeCustomerId && !!user?.defaultPaymentMethodId && paidCount >= 1

      if (isPostFactumEligible) {
        // Post-factum: allow entire current month; after month ends, ensure previous month is paid
        if (today <= currentEnd) {
          return NextResponse.json({ success: true, locked: false }, { headers: corsHeaders })
        }
        const prev = await (prisma as any).invoice.findFirst({ where: { userId, periodStart: prevStart, periodEnd: prevEnd } })
        const prevStatus = String(prev?.status || '').toUpperCase()
        const locked = !!prev && prevStatus !== 'PAID'
        return NextResponse.json({ success: true, locked }, { headers: corsHeaders })
      }

      // Standard mode: grace until 5th of current month
      const graceDay = 5
      const current = await (prisma as any).invoice.findFirst({ where: { userId, periodStart: currentStart, periodEnd: currentEnd } })
      if (today.getDate() < graceDay) {
        return NextResponse.json({ success: true, locked: false }, { headers: corsHeaders })
      }
      if (!current) {
        const companiesCount = await prisma.company.count({ where: { userId, isActive: true } })
        const locked = companiesCount > 0
        return NextResponse.json({ success: true, locked }, { headers: corsHeaders })
      }
      const status = String(current.status || '').toUpperCase()
      const isLocked = status !== 'PAID' && status !== 'PENDING'
      return NextResponse.json({ success: true, locked: isLocked }, { headers: corsHeaders })
    } catch {
      // Permissive fallback to avoid false-positive locks
      return NextResponse.json({ success: true, locked: false }, { headers: corsHeaders })
    }
  } catch (error) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Failed to get billing status' }, { status: 500, headers: corsHeaders })
  }
}
