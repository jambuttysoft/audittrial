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

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'Company ID and User ID are required' },
        { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') }
      )
    }

    const items = await prisma.digitizedReview.findMany({
      where: { companyId, userId },
      orderBy: { movedAt: 'desc' },
    })

    return NextResponse.json({ success: true, review: items }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch review items' },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
    )
  }
}

