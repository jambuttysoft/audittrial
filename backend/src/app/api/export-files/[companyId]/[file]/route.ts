import { NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

export async function OPTIONS(request: Request) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: Request, { params }: { params: Promise<{ companyId: string, file: string }> }) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const { companyId, file } = await params
    if (!companyId || !file) {
      return NextResponse.json({ error: 'companyId and file are required' }, { status: 400, headers: corsHeaders })
    }
    const fullPath = join(process.cwd(), 'storage', 'exports', companyId, file)
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404, headers: corsHeaders })
    }
    const buffer = await readFile(fullPath)
    const headers = new Headers(corsHeaders)
    const isJson = file.toLowerCase().endsWith('.json')
    headers.set('Content-Type', isJson ? 'application/json' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    headers.set('Content-Length', buffer.length.toString())
    headers.set('Content-Disposition', `attachment; filename="${file}"`)
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    return new NextResponse(buffer as any, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500, headers: corsHeaders })
  }
}
