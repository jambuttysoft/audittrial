import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString(), requestId }, { status, headers })
}

function badRequest(message: string, details?: any, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', error: { type: 'ValidationError', details }, message, timestamp: new Date().toISOString(), requestId }, { status: 400, headers })
}

function notFound(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'NOT_FOUND', message, timestamp: new Date().toISOString(), requestId }, { status: 404, headers })
}

function forbidden(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'FORBIDDEN', message, timestamp: new Date().toISOString(), requestId }, { status: 403, headers })
}

function conflict(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'CONFLICT', message, timestamp: new Date().toISOString(), requestId }, { status: 409, headers })
}

function serverError(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString(), requestId }, { status: 500, headers })
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin'))
}

export async function POST(request: NextRequest, context: any) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const p = context?.params
    const { id } = (p && typeof p.then === 'function') ? await p : p
    const body = await request.json()
    const { userId } = body || {}
    if (!userId) return badRequest('userId required', [{ field: 'userId', message: 'Required' }], corsHeaders, requestId)

    const actor = await prisma.user.findUnique({ where: { id: String(userId) }, select: { role: true } })
    if (!actor || (actor.role !== 'ADMIN' && actor.role !== 'SUPPORT')) return forbidden('Support or Admin role required', corsHeaders, requestId)

    const ticket = await prisma.ticket.findUnique({ where: { id: String(id) }, select: { id: true, assigneeId: true } })
    if (!ticket) return notFound('Ticket not found', corsHeaders, requestId)

    const updatedCount = await prisma.ticket.updateMany({
      where: { id: String(id), OR: [{ assigneeId: null }, { assigneeId: String(userId) }] },
      data: { assigneeId: String(userId), claimedAt: new Date(), status: 'IN_PROGRESS' },
    })
    if (updatedCount.count === 0) return conflict('Ticket already claimed by another user', corsHeaders, requestId)

    const updated = await prisma.ticket.findUnique({ where: { id: String(id) } })
    return ok({ ticket: updated }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('POST /api/tickets/[id]/claim error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to claim ticket', corsHeaders, requestId)
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const p = context?.params
    const { id } = (p && typeof p.then === 'function') ? await p : p
    const body = await request.json().catch(() => ({}))
    const { userId } = body || {}
    if (!userId) return badRequest('userId required', [{ field: 'userId', message: 'Required' }], corsHeaders, requestId)

    const actor = await prisma.user.findUnique({ where: { id: String(userId) }, select: { role: true } })
    if (!actor || (actor.role !== 'ADMIN' && actor.role !== 'SUPPORT')) return forbidden('Support or Admin role required', corsHeaders, requestId)

    const ticket = await prisma.ticket.findUnique({ where: { id: String(id) }, select: { assigneeId: true } })
    if (!ticket) return notFound('Ticket not found', corsHeaders, requestId)

    if (actor.role !== 'ADMIN' && ticket.assigneeId && ticket.assigneeId !== String(userId)) {
      return forbidden('Only assignee can unclaim the ticket', corsHeaders, requestId)
    }

    await prisma.ticket.update({ where: { id: String(id) }, data: { assigneeId: null, claimedAt: null, status: 'OPEN' } })
    const updated = await prisma.ticket.findUnique({ where: { id: String(id) } })
    return ok({ ticket: updated }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('DELETE /api/tickets/[id]/claim error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to unclaim ticket', corsHeaders, requestId)
  }
}

