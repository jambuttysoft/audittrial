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
    const type = searchParams.get('type')
    const userId = searchParams.get('userId') || ''
    const mine = (searchParams.get('mine') || '').toLowerCase() === 'true'
    const unassigned = (searchParams.get('unassigned') || '').toLowerCase() === 'true'
    const assignedToMe = (searchParams.get('assignedToMe') || '').toLowerCase() === 'true'
    const assigneeId = searchParams.get('assigneeId') || ''
    const ownerId = searchParams.get('ownerId') || ''
    const claimedParam = searchParams.get('claimed') || ''
    const hasAttachmentsParam = (searchParams.get('hasAttachments') || '').toLowerCase()
    const hasRepliesParam = (searchParams.get('hasReplies') || '').toLowerCase()
    const q = searchParams.get('q') || ''
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const sort = searchParams.get('sort') || 'createdAt_desc'
    const limitParam = Number(searchParams.get('limit') || 20)
    const offsetParam = Number(searchParams.get('offset') || 0)
    const limit = Math.min(Math.max(limitParam, 1), 100)
    const offset = Math.max(offsetParam, 0)

    const where: any = {}
    if (status) where.status = String(status).toUpperCase()
    if (type) where.type = String(type)
    if (unassigned) where.assigneeId = null
    if (assignedToMe && userId) where.assigneeId = String(userId)
    if (assigneeId) where.assigneeId = String(assigneeId)
    if (ownerId) where.userId = String(ownerId)
    if (claimedParam) {
      const val = claimedParam.toLowerCase()
      if (val === 'true') where.assigneeId = { not: null }
      if (val === 'false') where.assigneeId = null
    }
    if (hasAttachmentsParam === 'true') where.attachments = { some: {} }
    if (hasAttachmentsParam === 'false') where.attachments = { none: {} }
    if (hasRepliesParam === 'true') where.replies = { some: {} }
    if (hasRepliesParam === 'false') where.replies = { none: {} }
    if (q) {
      where.OR = [
        { subject: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    // Authorization: staff can list all; users can list only their own when mine=true
    if (mine) {
      if (!userId) return badRequest('userId required for mine=true', [{ field: 'userId', message: 'Required' }], corsHeaders, requestId)
      where.userId = String(userId)
    } else {
      const actorId = userId
      if (!actorId) return badRequest('userId required for staff listing', [{ field: 'userId', message: 'Required' }], corsHeaders, requestId)
      const actor = await (prisma as any).user.findUnique({ where: { id: actorId }, select: { role: true } })
      if (!actor || (actor.role !== 'ADMIN' && actor.role !== 'SUPPORT')) {
        return badRequest('Insufficient permissions', [{ field: 'role', message: 'ADMIN or SUPPORT required' }], corsHeaders, requestId)
      }
    }

    const orderBy = sort === 'createdAt_asc' ? { createdAt: 'asc' } : { createdAt: 'desc' }
    const [tickets, total] = await Promise.all([
      (prisma as any).ticket.findMany({ where, orderBy, skip: offset, take: limit }),
      (prisma as any).ticket.count({ where })
    ])

    return ok({ tickets, total, limit, offset }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('GET /api/tickets error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to list tickets', corsHeaders, requestId)
  }
}
