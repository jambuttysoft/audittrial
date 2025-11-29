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

    try {
      const list = await (prisma as any).invoice.findMany({
        where: { userId },
        orderBy: { generatedAt: 'desc' },
      })
      const invoices = list.map((i) => ({
        id: i.id,
        generatedAt: i.generatedAt.toISOString().slice(0, 10),
        periodStart: i.periodStart.toISOString().slice(0, 10),
        periodEnd: i.periodEnd.toISOString().slice(0, 10),
        activeCompanies: i.activeCompanies,
        amount: i.amount,
        status: i.status === 'PAID' ? 'PAID' : 'UNPAID',
        pdfUrl: i.status === 'PAID' && i.metadata?.pdfPath ? `/api/billing/invoice-file/${i.id}` : null,
      }))
      if (invoices.length === 0) {
        const now = new Date()
        const y = now.getFullYear()
        const m = now.getMonth()
        const start = new Date(y, m, 1)
        const end = new Date(y, m + 1, 0)
        const count = await prisma.company.count({ where: { userId, isActive: true } })
        const inv = await (prisma as any).invoice.create({
          data: {
            userId,
            periodStart: start,
            periodEnd: end,
            activeCompanies: count,
            amount: count * 20,
          },
        })
        invoices.push({
          id: inv.id,
          generatedAt: inv.generatedAt.toISOString().slice(0, 10),
          periodStart: inv.periodStart.toISOString().slice(0, 10),
          periodEnd: inv.periodEnd.toISOString().slice(0, 10),
          activeCompanies: inv.activeCompanies,
          amount: inv.amount,
          status: 'UNPAID',
        })
      }
      return NextResponse.json({ success: true, invoices }, { headers: corsHeaders })
    } catch {
      const companiesCount = await prisma.company.count({ where: { userId, isActive: true } })
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      const periodStart = new Date(y, m, 1)
      const periodEnd = new Date(y, m + 1, 0)
      const toISO = (d: Date) => d.toISOString().slice(0, 10)
      const invoices = [{
        id: `INV-${y}${String(m + 1).padStart(2, '0')}-${userId}`,
        generatedAt: toISO(periodEnd),
        periodStart: toISO(periodStart),
        periodEnd: toISO(periodEnd),
        activeCompanies: companiesCount,
        amount: companiesCount * 20,
        status: 'UNPAID',
      }]
      return NextResponse.json({ success: true, invoices }, { headers: corsHeaders })
    }
  } catch (error) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Failed to get invoices' }, { status: 500, headers: corsHeaders })
  }
}
