import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const form = await request.formData()
    const userId = String(form.get('userId') || '')
    const file = form.get('file') as File | null
    if (!userId || !file) {
      return NextResponse.json({ error: 'userId and file are required' }, { status: 400, headers: corsHeaders })
    }
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400, headers: corsHeaders })
    }
    const allowed = new Set(['image/png','image/jpeg','image/jpg','image/webp'])
    const mime = file.type || 'application/octet-stream'
    if (!allowed.has(mime)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400, headers: corsHeaders })
    }
    const { mkdir, writeFile } = await import('fs/promises')
    const { join } = await import('path')
    const dir = join(process.cwd(), 'storage', 'avatars', userId)
    await mkdir(dir, { recursive: true })
    const safeName = (file.name || 'avatar').replace(/[^a-zA-Z0-9._-]/g, '_')
    const ts = Date.now()
    const ext = mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg'
    const fileName = `${ts}-${safeName}${safeName.endsWith(ext) ? '' : ''}`
    const pathStr = join(dir, fileName)
    await writeFile(pathStr, buffer)
    const url = `/api/profile/avatar-file/${userId}?t=${ts}`
    await prisma.user.update({ where: { id: userId }, data: { avatar: url } })
    return NextResponse.json({ success: true, avatarUrl: url }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500, headers: corsHeaders })
  }
}

