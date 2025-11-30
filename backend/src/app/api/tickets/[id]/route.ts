import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString() }, { status })
}

function notFound(message: string) {
  return NextResponse.json({ success: false, code: 'NOT_FOUND', message, timestamp: new Date().toISOString() }, { status: 404 })
}

function serverError(message: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString() }, { status: 500 })
}

export async function GET(request: NextRequest, context: any) {
  try {
    const p = context?.params
    const { id } = (p && typeof p.then === 'function') ? await p : p
    const ticket = await (prisma as any).ticket.findUnique({
      where: { id },
      include: { replies: { orderBy: { createdAt: 'asc' }, include: { attachments: true } }, attachments: true }
    })
    if (!ticket) return notFound('Ticket not found')
    return ok({ ticket })
  } catch {
    return serverError('Failed to get ticket')
  }
}
