import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const userId = searchParams.get('userId')
    const file = searchParams.get('file') || ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (!companyId || !userId) {
      return NextResponse.json({ error: 'Company ID and User ID are required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const where: any = { companyId, userId }
    if (file) where.fileName = { contains: file }
    if (from || to) {
      const fromDate = from ? new Date(from) : null
      const toDate = to ? new Date(to) : null
      const validFrom = fromDate && !isNaN(fromDate.getTime()) ? fromDate : null
      const validTo = toDate && !isNaN(toDate.getTime()) ? toDate : null
      if (validFrom || validTo) {
        where.exportedAt = {}
        if (validFrom) where.exportedAt.gte = validFrom
        if (validTo) where.exportedAt.lte = validTo
      }
    }
    const items = await (prisma as any).exportHistory.findMany({ where, orderBy: { exportedAt: 'desc' } })
    const stats = {
      total: items.length,
      success: items.filter((i: any) => i.status === 'SUCCESS').length,
      failed: items.filter((i: any) => i.status !== 'SUCCESS').length,
      rowsExported: items.reduce((acc: number, i: any) => acc + (i.totalRows || 0), 0),
    }
    return NextResponse.json({ success: true, history: items, stats }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch export history' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}
