import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
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
        try {
          const user = await prisma.user.findUnique({ where: { id: userId } }) as any
          const paidCount = await (prisma as any).invoice.count({ where: { userId, status: 'PAID' } })
          const eligible = !!user?.autoChargeEnabled && !!user?.stripeCustomerId && !!user?.defaultPaymentMethodId && paidCount >= 1 && (inv.amount || 0) > 0
          if (eligible) {
            const key = process.env.STRIPE_SECRET_KEY
            if (key && key.startsWith('sk_')) {
              const stripe = new Stripe(key)
              const amountCents = Math.round((inv.amount || 0) * 100)
              try {
                const pi = await stripe.paymentIntents.create({
                  amount: amountCents,
                  currency: 'aud',
                  customer: user!.stripeCustomerId!,
                  payment_method: user!.defaultPaymentMethodId!,
                  off_session: true,
                  confirm: true,
                  description: `Monthly billing ${start.toISOString().slice(0,10)} - ${end.toISOString().slice(0,10)}`,
                  metadata: { invoiceId: inv.id, userId },
                })
                await (prisma as any).invoice.update({
                  where: { id: inv.id },
                  data: {
                    status: 'PAID',
                    paidAt: new Date(),
                    metadata: { stripePaymentIntentId: pi.id, offSession: true },
                  },
                })
              } catch (err: any) {
                const msg = typeof err?.message === 'string' ? err.message : 'off_session_failed'
                await (prisma as any).invoice.update({
                  where: { id: inv.id },
                  data: { status: 'PENDING', metadata: { lastError: msg } },
                })
              }
            }
          }
        } catch {}
        {
          const latest = await (prisma as any).invoice.findUnique({ where: { id: inv.id } })
          invoices.push({
            id: latest.id,
            generatedAt: latest.generatedAt.toISOString().slice(0, 10),
            periodStart: latest.periodStart.toISOString().slice(0, 10),
            periodEnd: latest.periodEnd.toISOString().slice(0, 10),
            activeCompanies: latest.activeCompanies,
            amount: latest.amount,
            status: latest.status === 'PAID' ? 'PAID' : 'UNPAID',
          })
        }
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
