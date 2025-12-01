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
    const { userId, content } = body || {}
    if (!userId || !content) {
      return badRequest('Required fields missing', [
        { field: 'userId', message: 'Required' },
        { field: 'content', message: 'Required' },
      ], corsHeaders, requestId)
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: String(id) }, select: { id: true, userId: true } })
    if (!ticket) return notFound('Ticket not found', corsHeaders, requestId)

    const actor = await prisma.user.findUnique({ where: { id: String(userId) }, select: { role: true } })
    if (!actor) return forbidden('User not found or inactive', corsHeaders, requestId)

    const isStaff = actor.role === 'ADMIN' || actor.role === 'SUPPORT'
    if (!isStaff && ticket.userId !== String(userId)) {
      return forbidden('Only ticket owner can reply', corsHeaders, requestId)
    }

    const reply = await prisma.ticketReply.create({
      data: { ticketId: String(id), userId: String(userId), body: String(content) },
    })

    // If staff replied, mark ticket as in progress
    if (isStaff) {
      await prisma.ticket.update({ where: { id: String(id) }, data: { status: 'IN_PROGRESS' } })
    }

    return ok({ reply }, 201, corsHeaders, requestId)
  } catch (error: any) {
    console.error('POST /api/tickets/[id]/reply error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to add reply', corsHeaders, requestId)
  }
}

