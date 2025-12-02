import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { join } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400, headers: corsHeaders })
    }
    const dir = join(process.cwd(), 'storage', 'avatars', userId)
    let latestPath = ''
    try {
      const { readdir } = await import('fs/promises')
      const files = await readdir(dir)
      const sorted = files.sort((a,b) => Number(a.split('-')[0]) < Number(b.split('-')[0]) ? 1 : -1)
      if (sorted.length) latestPath = join(dir, sorted[0])
    } catch {}
    if (!latestPath || !existsSync(latestPath)) {
      return NextResponse.json({ error: 'Avatar not found' }, { status: 404, headers: corsHeaders })
    }
    const buf = await readFile(latestPath)
    const headers = new Headers(corsHeaders)
    const isPng = latestPath.toLowerCase().endsWith('.png')
    const isWebp = latestPath.toLowerCase().endsWith('.webp')
    headers.set('Content-Type', isPng ? 'image/png' : isWebp ? 'image/webp' : 'image/jpeg')
    headers.set('Content-Length', buf.length.toString())
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    return new NextResponse(buf as any, { status: 200, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500, headers: corsHeaders })
  }
}

