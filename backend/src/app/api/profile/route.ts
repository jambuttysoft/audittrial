import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
    const data = {
      // @ts-ignore - abn field added manually
      abn: (user as any).abn,
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      phone: user.phone,
      address: user.address,
      website: user.website,
      avatar: user.avatar,
      company: user.company,
      services: user.services,
      isVisibleToClients: user.isVisibleToClients,
      acceptsJobOffers: user.acceptsJobOffers,
      autoChargeEnabled: (user as any).autoChargeEnabled || false,
      stripeCustomerId: (user as any).stripeCustomerId || null,
      defaultPaymentMethodId: (user as any).defaultPaymentMethodId || null,
    }
    // @ts-ignore - abn field may not be in type
    return NextResponse.json({ success: true, profile: data }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}
