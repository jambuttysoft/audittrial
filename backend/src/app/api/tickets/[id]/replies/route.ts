import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTicketReplyEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString() }, { status })
}

function badRequest(message: string, details?: any) {
  return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', error: { type: 'ValidationError', details }, message, timestamp: new Date().toISOString() }, { status: 400 })
}

function notFound(message: string) {
  return NextResponse.json({ success: false, code: 'NOT_FOUND', message, timestamp: new Date().toISOString() }, { status: 404 })
}

function serverError(message: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString() }, { status: 500 })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const form = await request.formData()
    const userId = String(form.get('userId') || '')
    const body = String(form.get('body') || '')
    if (!userId || !body) {
      return badRequest('Required fields missing', [
        { field: 'userId', message: 'Required' },
        { field: 'body', message: 'Required' }
      ])
    }

    const ticket = await (prisma as any).ticket.findUnique({ where: { id } })
    if (!ticket) return notFound('Ticket not found')

    const reply = await (prisma as any).ticketReply.create({ data: { ticketId: id, userId, body } })

    const files = form.getAll('files') as File[]
    if (files && files.length) {
      const { mkdir, writeFile } = await import('fs/promises')
      const { join } = await import('path')
      const dir = join(process.cwd(), 'storage', 'tickets', id, 'replies', reply.id)
      await mkdir(dir, { recursive: true })
      for (const f of files) {
        const bytes = await f.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const ts = Date.now()
        const fileName = `${ts}-${safeName}`
        const pathStr = join(dir, fileName)
        await writeFile(pathStr, buffer)
        await (prisma as any).ticketAttachment.create({
          data: {
            replyId: reply.id,
            userId,
            fileName,
            filePath: pathStr,
            mimeType: f.type || 'application/octet-stream',
            fileSize: buffer.length,
          }
        })
      }
    }

    try {
      const user = await (prisma as any).user.findUnique({ where: { id: ticket.userId } })
      if (user?.email) await sendTicketReplyEmail({ to: user.email, ticketId: id, replyBody: body })
    } catch {}
    return ok({ reply }, 201)
  } catch {
    return serverError('Failed to add reply')
  }
}
