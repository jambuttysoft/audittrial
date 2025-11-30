import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString() }, { status })
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', message, timestamp: new Date().toISOString() }, { status: 400 })
}

function notFound(message: string) {
  return NextResponse.json({ success: false, code: 'NOT_FOUND', message, timestamp: new Date().toISOString() }, { status: 404 })
}

function serverError(message: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString() }, { status: 500 })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const payload = await request.json()
    const status = String(payload?.status || '').toUpperCase()
    if (!['OPEN', 'CLOSED'].includes(status)) return badRequest('Invalid status')

    const ticket = await (prisma as any).ticket.update({ where: { id }, data: { status } })
    return ok({ ticket })
  } catch (e: any) {
    if (e?.code === 'P2025') return notFound('Ticket not found')
    return serverError('Failed to update status')
  }
}
