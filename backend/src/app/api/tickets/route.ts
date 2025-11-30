import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTicketCreatedEmail } from '@/lib/email'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString(), requestId }, { status, headers })
}

function badRequest(message: string, details?: any, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', error: { type: 'ValidationError', details }, message, timestamp: new Date().toISOString(), requestId }, { status: 400, headers })
}

function serverError(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString(), requestId }, { status: 500, headers })
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const body = await request.json()
    const { userId, type, subject, body: content } = body || {}
    if (!userId || !type || !subject || !content) {
      return badRequest('Required fields missing', [
        { field: 'userId', message: 'Required' },
        { field: 'type', message: 'Required' },
        { field: 'subject', message: 'Required' },
        { field: 'body', message: 'Required' }
      ], corsHeaders, requestId)
    }

    const ticket = await (prisma as any).ticket.create({
      data: { userId: String(userId), type: String(type), subject: String(subject), body: String(content), status: 'OPEN' }
    })
    try {
      const user = await (prisma as any).user.findUnique({ where: { id: userId } })
      if (user?.email) await sendTicketCreatedEmail({ to: user.email, subject, body: content, ticketId: ticket.id })
    } catch {}
    return ok({ ticket }, 201, corsHeaders, requestId)
  } catch (error: any) {
    console.error('POST /api/tickets error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to create ticket', corsHeaders, requestId)
  }
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limitParam = Number(searchParams.get('limit') || 20)
    const offsetParam = Number(searchParams.get('offset') || 0)
    const limit = Math.min(Math.max(limitParam, 1), 100)
    const offset = Math.max(offsetParam, 0)

    const where: any = {}
    if (status) where.status = String(status).toUpperCase()

    const [tickets, total] = await Promise.all([
      (prisma as any).ticket.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit }),
      (prisma as any).ticket.count({ where })
    ])

    return ok({ tickets, total, limit, offset }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('GET /api/tickets error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to list tickets', corsHeaders, requestId)
  }
}
