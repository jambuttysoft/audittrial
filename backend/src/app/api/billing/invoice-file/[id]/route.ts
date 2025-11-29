import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const { id } = await params
    const inv = await (prisma as any).invoice.findUnique({ where: { id } })
    const path = inv?.metadata?.pdfPath
    if (!path) {
      return NextResponse.json({ error: 'PDF not available for this invoice' }, { status: 404, headers: corsHeaders })
    }
    const fullPath = join(process.cwd(), path)
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'PDF file not found' }, { status: 404, headers: corsHeaders })
    }
    const buf = await readFile(fullPath)
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Length', buf.length.toString())
    headers.set('Content-Disposition', `attachment; filename="${path.split('/').pop()}"`)
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    return new NextResponse(buf as any, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download invoice PDF' }, { status: 500, headers: corsHeaders })
  }
}
