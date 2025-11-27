import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest, { params }: { params: { companyId: string, file: string } }) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const companyId = params.companyId
    const file = params.file
    if (!companyId || !file) {
      return NextResponse.json({ error: 'companyId and file are required' }, { status: 400, headers: corsHeaders })
    }
    const fullPath = join(process.cwd(), 'storage', 'exports', companyId, file)
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404, headers: corsHeaders })
    }
    const buffer = await readFile(fullPath)
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    headers.set('Content-Length', buffer.length.toString())
    headers.set('Content-Disposition', `attachment; filename="${file}"`)
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    const ab = new ArrayBuffer(buffer.byteLength)
    new Uint8Array(ab).set(buffer)
    const blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    return new NextResponse(blob as any, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500, headers: corsHeaders })
  }
}
