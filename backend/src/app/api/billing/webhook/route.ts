import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { sendInvoicePaidEmail } from '@/lib/email'
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
          const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
          const brand = 'TRAKYYT'
          const companyName = process.env.COMPANY_NAME || 'TRAKYYT Pty Ltd'
          const companyAddress = process.env.COMPANY_ADDRESS || 'Australia'
          const companyVat = process.env.COMPANY_VAT || ''
          const customerName = (user as any)?.name || (user?.email || inv.userId)
          const customerCompany = (user as any)?.company || ''
          const customerAddress = (user as any)?.address || ''
          page.drawRectangle({ x: 0, y: 800, width: 595.28, height: 20, color: rgb(0.2, 0.3, 0.9) })
          page.drawText(brand, { x: 30, y: 805, size: 14, font: bold, color: rgb(1, 1, 1) })
          page.drawText('Date', { x: 420, y: 810, size: 9, font: font, color: rgb(1,1,1) })
          page.drawText(new Date(inv.generatedAt).toISOString().slice(0,10), { x: 420, y: 800, size: 10, font: bold, color: rgb(1,1,1) })
          page.drawText('Invoice #', { x: 500, y: 810, size: 9, font: font, color: rgb(1,1,1) })
          page.drawText(inv.id, { x: 500, y: 800, size: 10, font: bold, color: rgb(1,1,1) })
          page.drawRectangle({ x: 0, y: 740, width: 595.28, height: 60, color: rgb(0.95,0.97,1) })
          page.drawText('Supplier', { x: 30, y: 780, size: 11, font: bold })
          page.drawText(companyName, { x: 30, y: 765, size: 10, font: font })
          if (companyVat) page.drawText(`VAT: ${companyVat}`, { x: 30, y: 752, size: 9, font: font })
          page.drawText(companyAddress, { x: 30, y: 739, size: 9, font: font })
          page.drawText('Customer', { x: 320, y: 780, size: 11, font: bold })
          page.drawText(customerCompany || customerName, { x: 320, y: 765, size: 10, font: font })
          page.drawText(customerName, { x: 320, y: 752, size: 9, font: font })
          if (customerAddress) page.drawText(customerAddress, { x: 320, y: 739, size: 9, font: font })
          const headersY = 710
          page.drawText('#', { x: 35, y: headersY, size: 10, font: bold })
          page.drawText('Product', { x: 60, y: headersY, size: 10, font: bold })
          page.drawText('Price', { x: 300, y: headersY, size: 10, font: bold })
          page.drawText('Qty', { x: 360, y: headersY, size: 10, font: bold })
          page.drawText('Subtotal', { x: 410, y: headersY, size: 10, font: bold })
          page.drawText('Total', { x: 500, y: headersY, size: 10, font: bold })
          page.drawLine({ start: { x: 30, y: headersY-5 }, end: { x: 565, y: headersY-5 }, color: rgb(0.2,0.3,0.9) })
          const unit = 20
          const qty = Number(inv.activeCompanies || 0)
          const subtotal = unit * qty
          page.drawText('1.', { x: 35, y: 690, size: 10, font: font })
          page.drawText(`Monthly subscription (${qty} active companies)`, { x: 60, y: 690, size: 10, font: font })
          page.drawText(`$${unit.toFixed(2)}`, { x: 300, y: 690, size: 10, font: font })
          page.drawText(String(qty), { x: 360, y: 690, size: 10, font: font })
          page.drawText(`$${subtotal.toFixed(2)}`, { x: 410, y: 690, size: 10, font: font })
          page.drawText(`$${subtotal.toFixed(2)}`, { x: 500, y: 690, size: 10, font: font })
          page.drawLine({ start: { x: 30, y: 675 }, end: { x: 565, y: 675 }, color: rgb(0.85,0.85,0.9) })
          page.drawText('Net total:', { x: 400, y: 650, size: 10, font: font, color: rgb(0.4,0.4,0.4) })
          page.drawText(`$${subtotal.toFixed(2)}`, { x: 500, y: 650, size: 11, font: bold, color: rgb(0.1,0.2,0.8) })
          page.drawText('GST:', { x: 400, y: 633, size: 10, font: font, color: rgb(0.4,0.4,0.4) })
          page.drawText('$0.00', { x: 500, y: 633, size: 11, font: bold, color: rgb(0.1,0.2,0.8) })
          page.drawRectangle({ x: 395, y: 600, width: 170, height: 24, color: rgb(0.2,0.3,0.9) })
          page.drawText('Total:', { x: 405, y: 607, size: 11, font: bold, color: rgb(1,1,1) })
          page.drawText(`$${subtotal.toFixed(2)}`, { x: 470, y: 607, size: 11, font: bold, color: rgb(1,1,1) })
          page.drawText('Payment', { x: 30, y: 570, size: 11, font: bold })
          page.drawText('Paid via Stripe', { x: 30, y: 555, size: 10, font: font })
          page.drawText(`Session: ${session.id}`, { x: 30, y: 542, size: 9, font: font })
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
          if (user?.email) {
            await sendInvoicePaidEmail({
              to: user.email,
              invoiceId: inv.id,
              periodStart: new Date(inv.periodStart),
              periodEnd: new Date(inv.periodEnd),
              amount: Number(inv.amount || 0),
              filePath,
            })
          }
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
          const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
          const brand = 'TRAKYYT'
          const companyName = process.env.COMPANY_NAME || 'TRAKYYT Pty Ltd'
          const companyAddress = process.env.COMPANY_ADDRESS || 'Australia'
          const companyVat = process.env.COMPANY_VAT || ''
          const customerName = (user as any)?.name || (user?.email || inv.userId)
          const customerCompany = (user as any)?.company || ''
          const customerAddress = (user as any)?.address || ''
          page.drawRectangle({ x: 0, y: 800, width: 595.28, height: 20, color: rgb(0.2, 0.3, 0.9) })
          page.drawText(brand, { x: 30, y: 805, size: 14, font: bold, color: rgb(1, 1, 1) })
          page.drawText('Date', { x: 420, y: 810, size: 9, font: font, color: rgb(1,1,1) })
          page.drawText(new Date(inv.generatedAt).toISOString().slice(0,10), { x: 420, y: 800, size: 10, font: bold, color: rgb(1,1,1) })
          page.drawText('Invoice #', { x: 500, y: 810, size: 9, font: font, color: rgb(1,1,1) })
          page.drawText(inv.id, { x: 500, y: 800, size: 10, font: bold, color: rgb(1,1,1) })
          page.drawRectangle({ x: 0, y: 740, width: 595.28, height: 60, color: rgb(0.95,0.97,1) })
          page.drawText('Supplier', { x: 30, y: 780, size: 11, font: bold })
          page.drawText(companyName, { x: 30, y: 765, size: 10, font: font })
          if (companyVat) page.drawText(`VAT: ${companyVat}`, { x: 30, y: 752, size: 9, font: font })
          page.drawText(companyAddress, { x: 30, y: 739, size: 9, font: font })
          page.drawText('Customer', { x: 320, y: 780, size: 11, font: bold })
          page.drawText(customerCompany || customerName, { x: 320, y: 765, size: 10, font: font })
          page.drawText(customerName, { x: 320, y: 752, size: 9, font: font })
          if (customerAddress) page.drawText(customerAddress, { x: 320, y: 739, size: 9, font: font })
          const headersY2 = 710
          page.drawText('#', { x: 35, y: headersY2, size: 10, font: bold })
          page.drawText('Product', { x: 60, y: headersY2, size: 10, font: bold })
          page.drawText('Price', { x: 300, y: headersY2, size: 10, font: bold })
          page.drawText('Qty', { x: 360, y: headersY2, size: 10, font: bold })
          page.drawText('Subtotal', { x: 410, y: headersY2, size: 10, font: bold })
          page.drawText('Total', { x: 500, y: headersY2, size: 10, font: bold })
          page.drawLine({ start: { x: 30, y: headersY2-5 }, end: { x: 565, y: headersY2-5 }, color: rgb(0.2,0.3,0.9) })
          const unit2 = 20
          const qty2 = Number(inv.activeCompanies || 0)
          const subtotal2 = unit2 * qty2
          page.drawText('1.', { x: 35, y: 690, size: 10, font: font })
          page.drawText(`Monthly subscription (${qty2} active companies)`, { x: 60, y: 690, size: 10, font: font })
          page.drawText(`$${unit2.toFixed(2)}`, { x: 300, y: 690, size: 10, font: font })
          page.drawText(String(qty2), { x: 360, y: 690, size: 10, font: font })
          page.drawText(`$${subtotal2.toFixed(2)}`, { x: 410, y: 690, size: 10, font: font })
          page.drawText(`$${subtotal2.toFixed(2)}`, { x: 500, y: 690, size: 10, font: font })
          page.drawLine({ start: { x: 30, y: 675 }, end: { x: 565, y: 675 }, color: rgb(0.85,0.85,0.9) })
          page.drawText('Net total:', { x: 400, y: 650, size: 10, font: font, color: rgb(0.4,0.4,0.4) })
          page.drawText(`$${subtotal2.toFixed(2)}`, { x: 500, y: 650, size: 11, font: bold, color: rgb(0.1,0.2,0.8) })
          page.drawText('GST:', { x: 400, y: 633, size: 10, font: font, color: rgb(0.4,0.4,0.4) })
          page.drawText('$0.00', { x: 500, y: 633, size: 11, font: bold, color: rgb(0.1,0.2,0.8) })
          page.drawRectangle({ x: 395, y: 600, width: 170, height: 24, color: rgb(0.2,0.3,0.9) })
          page.drawText('Total:', { x: 405, y: 607, size: 11, font: bold, color: rgb(1,1,1) })
          page.drawText(`$${subtotal2.toFixed(2)}`, { x: 470, y: 607, size: 11, font: bold, color: rgb(1,1,1) })
          page.drawText('Payment', { x: 30, y: 570, size: 11, font: bold })
          page.drawText('Paid via Stripe', { x: 30, y: 555, size: 10, font: font })
          page.drawText(`Payment Intent: ${pi.id}`, { x: 30, y: 542, size: 9, font: font })
          const pdfBytes2 = await pdfDoc.save()
          writeFileSync(filePath, pdfBytes2)
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
          const user2 = await prisma.user.findUnique({ where: { id: inv.userId }, select: { email: true } })
          if (user2?.email) {
            await sendInvoicePaidEmail({
              to: user2.email,
              invoiceId: inv.id,
              periodStart: new Date(inv.periodStart),
              periodEnd: new Date(inv.periodEnd),
              amount: Number(inv.amount || 0),
              filePath,
            })
          }
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
        case 'checkout.session.async_payment_succeeded': {
          const session = event.data.object as Stripe.Checkout.Session
          const invoiceId = session.metadata?.invoiceId || session.client_reference_id || ''
          if (!invoiceId) break
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              metadata: {
                stripeSessionId: session.id,
                paymentStatus: 'succeeded',
                async: true,
              },
            },
          })
          break
        }
        case 'checkout.session.async_payment_failed': {
          const session = event.data.object as Stripe.Checkout.Session
          const invoiceId = session.metadata?.invoiceId || session.client_reference_id || ''
          if (!invoiceId) break
          await (prisma as any).invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'FAILED',
              metadata: {
                stripeSessionId: session.id,
                paymentStatus: 'failed',
                async: true,
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
