import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return handleCorsOptions(origin);
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    const key = process.env.STRIPE_SECRET_KEY
    if (!secret || !key) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500, headers: corsHeaders })
    }

    const stripe = new Stripe(key)
    const sig = request.headers.get('stripe-signature') || ''
    const body = await request.text()

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, sig, secret)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400, headers: corsHeaders })
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          const invoiceId = session.metadata?.invoiceId || session.client_reference_id || ''
          if (!invoiceId) break

          // Persist Stripe customer and default payment method
          const customerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id
          if (customerId) {
            const inv = await (prisma as any).invoice.findUnique({ where: { id: invoiceId } })
            if (inv) {
              await (prisma as any).user.update({ where: { id: inv.userId }, data: { stripeCustomerId: customerId } })
            }
          }
          if (session.payment_intent) {
            const piId = typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent as any)?.id
            try {
              const pi = await stripe.paymentIntents.retrieve(piId)
              const pmId = typeof pi.payment_method === 'string' ? pi.payment_method : (pi.payment_method as any)?.id
              if (pmId && customerId) {
                try { await stripe.paymentMethods.attach(pmId, { customer: customerId }) } catch {}
                try { await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: pmId } }) } catch {}
                const inv = await (prisma as any).invoice.findUnique({ where: { id: invoiceId } })
                if (inv) {
                  await (prisma as any).user.update({ where: { id: inv.userId }, data: { defaultPaymentMethodId: pmId, autoChargeEnabled: true } })
                }
              }
            } catch {}
          }

          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              metadata: {
                stripeSessionId: session.id,
                paymentStatus: session.payment_status,
              },
            },
          })

          const inv = await (prisma as any).invoice.findUnique({ where: { id: invoiceId } })
          if (!inv) break
          const user = await prisma.user.findUnique({ where: { id: inv.userId }, select: { email: true } })
          const folder = join(process.cwd(), 'storage', 'invoices', 'paid', inv.userId)
          if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
          const fileName = `invoice_${invoiceId}.pdf`
          const filePath = join(folder, fileName)

          const PDFLib: any = await import('pdf-lib')
          const { PDFDocument, StandardFonts, rgb } = PDFLib
          const pdfDoc = await PDFDocument.create()
          const page = pdfDoc.addPage([595.28, 841.89])
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
          let y = 800
          const draw = (text: string, size = 12) => {
            page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) })
            y -= size + 8
          }
          draw('TRAKYYT Invoice', 18)
          draw(`Invoice ID: ${inv.id}`)
          draw(`Date: ${new Date(inv.generatedAt).toISOString().slice(0,10)}`)
          draw(`Period: ${new Date(inv.periodStart).toISOString().slice(0,10)} - ${new Date(inv.periodEnd).toISOString().slice(0,10)}`)
          draw(`User: ${user?.email || inv.userId}`)
          draw(`Active Companies: ${inv.activeCompanies}`)
          draw(`Amount: $${Number(inv.amount).toFixed(2)} AUD`)
          draw(`Status: PAID`)
          draw('Payment Details')
          draw(`Stripe Session: ${session.id}`)
          draw(`Payment Status: ${session.payment_status}`)
          const pdfBytes = await pdfDoc.save()
          writeFileSync(filePath, pdfBytes)

          const relativePath = ['storage', 'invoices', 'paid', inv.userId, fileName].join('/')
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              metadata: {
                stripeSessionId: session.id,
                paymentStatus: session.payment_status,
                pdfPath: relativePath,
              },
            },
          })
          break
        }
        case 'payment_intent.succeeded': {
          const pi = event.data.object as Stripe.PaymentIntent
          const invoiceId = (pi.metadata as any)?.invoiceId
          if (!invoiceId) break
          const inv = await (prisma as any).invoice.findUnique({ where: { id: invoiceId } })
          if (!inv) break
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              metadata: {
                stripePaymentIntentId: pi.id,
                paymentStatus: 'succeeded',
                offSession: true,
              },
            },
          })
          const user = await prisma.user.findUnique({ where: { id: inv.userId }, select: { email: true } })
          const folder = join(process.cwd(), 'storage', 'invoices', 'paid', inv.userId)
          if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
          const fileName = `invoice_${invoiceId}.pdf`
          const filePath = join(folder, fileName)
          const PDFLib: any = await import('pdf-lib')
          const { PDFDocument, StandardFonts, rgb } = PDFLib
          const pdfDoc = await PDFDocument.create()
          const page = pdfDoc.addPage([595.28, 841.89])
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
          let y = 800
          const draw = (text: string, size = 12) => {
            page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) })
            y -= size + 8
          }
          draw('TRAKYYT Invoice', 18)
          draw(`Invoice ID: ${inv.id}`)
          draw(`Date: ${new Date(inv.generatedAt).toISOString().slice(0,10)}`)
          draw(`Period: ${new Date(inv.periodStart).toISOString().slice(0,10)} - ${new Date(inv.periodEnd).toISOString().slice(0,10)}`)
          draw(`User: ${user?.email || inv.userId}`)
          draw(`Active Companies: ${inv.activeCompanies}`)
          draw(`Amount: $${Number(inv.amount).toFixed(2)} AUD`)
          draw(`Status: PAID`)
          draw('Payment Details')
          draw(`Payment Intent: ${pi.id}`)
          draw(`Payment Status: succeeded`)
          const pdfBytes = await pdfDoc.save()
          writeFileSync(filePath, pdfBytes)
          const relativePath = ['storage', 'invoices', 'paid', inv.userId, fileName].join('/')
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              metadata: {
                stripePaymentIntentId: pi.id,
                paymentStatus: 'succeeded',
                offSession: true,
                pdfPath: relativePath,
              },
            },
          })
          break
        }
        case 'payment_intent.payment_failed': {
          const pi = event.data.object as Stripe.PaymentIntent
          const invoiceId = (pi.metadata as any)?.invoiceId
          if (!invoiceId) break
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'FAILED',
              metadata: {
                stripePaymentIntentId: pi.id,
                lastError: pi.last_payment_error?.message || 'payment_failed',
              },
            },
          })
          break
        }
        default:
          break
      }
    } catch (err: any) {
      console.error('Webhook event processing error:', err?.message || err)
      // Do not fail the webhook; acknowledge to avoid endless retries
    }

    return NextResponse.json({ received: true }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook handling error' }, { status: 500, headers: corsHeaders })
  }
}
