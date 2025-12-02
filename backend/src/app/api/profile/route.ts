import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders })
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        phone: true,
        address: true,
        website: true,
        avatar: true,
        company: true,
        abn: true,
        services: true,
        isVisibleToClients: true,
        acceptsJobOffers: true,
        autoChargeEnabled: true,
      },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }
    return NextResponse.json({ success: true, profile: user }, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500, headers: corsHeaders })
  }
}

