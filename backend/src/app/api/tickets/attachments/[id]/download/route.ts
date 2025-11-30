import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function notFound(message: string) {
  return NextResponse.json({ success: false, code: 'NOT_FOUND', message, timestamp: new Date().toISOString() }, { status: 404 })
}

function serverError(message: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString() }, { status: 500 })
}

export async function GET(_request: NextRequest, context: any) {
  try {
    const p = context?.params
    const { id } = (p && typeof p.then === 'function') ? await p : p
    const att = await (prisma as any).ticketAttachment.findUnique({ where: { id } })
    if (!att) return notFound('Attachment not found')
    const { readFile } = await import('fs/promises')
    const buf = await readFile(att.filePath)
    const data = new Uint8Array(buf)
    const mime = att.mimeType || 'application/octet-stream'
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `inline; filename="${att.fileName}"`
      }
    })
  } catch (e: any) {
    return serverError('Failed to download attachment')
  }
}
