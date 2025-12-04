import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')
    if (!userId || !companyId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'userId and companyId are required' }, { status: 400, headers: corsHeaders })
    }
    const items = await (prisma as any).digitizedReview.findMany({ where: { userId, companyId }, orderBy: { movedAt: 'desc' } })
    return NextResponse.json({ success: true, code: 'SUCCESS', review: items, message: 'Operation completed successfully' }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message: 'Failed to fetch review items' }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    const permanent = searchParams.get('permanent')
    if (!id || !userId) {
      return NextResponse.json({ success: false, code: 'BAD_REQUEST', message: 'id and userId are required' }, { status: 400, headers: corsHeaders })
    }
    const doc = await (prisma as any).digitizedReview.findUnique({ where: { id: String(id) } })
    if (!doc || doc.userId !== userId) {
      return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Item not found' }, { status: 404, headers: corsHeaders })
    }
    try {
      const p = doc.filePath ? (doc.filePath.startsWith('/') ? doc.filePath : join(process.cwd(), doc.filePath)) : ''
      if (p && existsSync(p)) unlinkSync(p)
    } catch {}
    await (prisma as any).digitizedReview.delete({ where: { id: String(id) } })
    return NextResponse.json({ success: true, code: 'SUCCESS', message: permanent ? 'Item erased permanently' : 'Item deleted' }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message: 'Failed to delete review item' }, { status: 500, headers: corsHeaders })
  }
}
