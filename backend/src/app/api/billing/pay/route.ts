import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return handleCorsOptions(origin);
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const body = await request.json()
    const { invoiceId, userId } = body
    if (!invoiceId || !userId) {
      return NextResponse.json({ error: 'invoiceId and userId are required' }, { status: 400, headers: corsHeaders })
    }
    try {
      const inv = await (prisma as any).invoice.findFirst({ where: { id: invoiceId, userId } })
      if (!inv) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404, headers: corsHeaders })
      }

      if (!inv.amount || inv.amount <= 0) {
        return NextResponse.json({ error: 'Invoice amount must be greater than 0' }, { status: 400, headers: corsHeaders })
      }

      const secret = process.env.STRIPE_SECRET_KEY
      if (!secret) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 500, headers: corsHeaders })
      }
      if (secret.startsWith('pk_') || !secret.startsWith('sk_')) {
        return NextResponse.json({ error: 'Stripe secret key invalid' }, { status: 500, headers: corsHeaders })
      }

      const stripe = new Stripe(secret)
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3646'
      const amountCents = Math.round(inv.amount * 100)
      const user: any = await prisma.user.findUnique({ where: { id: userId } })

      let customerId = user?.stripeCustomerId || undefined
      if (!customerId && user?.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId }
        })
        customerId = customer.id
        await (prisma as any).user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${baseUrl}/billing?paid=1&invoiceId=${inv.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/billing?cancelled=1&invoiceId=${inv.id}`,
        currency: 'aud',
        client_reference_id: inv.id,
        ...(customerId ? { customer: customerId } : { customer_email: user?.email || undefined }),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'aud',
              unit_amount: amountCents,
              product_data: {
                name: `Monthly billing (${inv.periodStart.toISOString().slice(0,10)} - ${inv.periodEnd.toISOString().slice(0,10)})`,
                description: `${inv.activeCompanies} active companies x $20`,
              },
            },
          },
        ],
        metadata: {
          invoiceId: inv.id,
          userId,
        },
        payment_intent_data: {
          setup_future_usage: 'off_session',
          metadata: {
            invoiceId: inv.id,
            userId,
          },
        },
      })

      await (prisma as any).invoice.update({
        where: { id: inv.id },
        data: {
          status: 'PENDING',
          metadata: {
            stripeSessionId: session.id,
          },
        },
      })

      return NextResponse.json({ success: true, url: session.url }, { headers: corsHeaders })
    } catch (e: any) {
      const message = typeof e?.message === 'string' ? e.message : 'Payment initiation failed'
      try {
        await (prisma as any).invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'FAILED',
            metadata: {
              lastError: message,
            },
          },
        })
      } catch {}
      return NextResponse.json({ error: 'Payment initiation failed', details: message }, { status: 500, headers: corsHeaders })
    }
  } catch (error) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500, headers: corsHeaders })
  }
}
