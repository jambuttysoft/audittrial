import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function PATCH(request: NextRequest) {
  try {
    const cors = getCorsHeaders(request.headers.get('origin') || '')
    const body = await request.json()
    const { userId, name, userType, phone, address, website, avatar, company, services, isVisibleToClients, acceptsJobOffers, autoChargeEnabled, abn } = body
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: cors })
    }
    const data: any = {}
    if (typeof name !== 'undefined') data.name = name
    if (typeof userType !== 'undefined') data.userType = userType
    if (typeof phone !== 'undefined') data.phone = phone
    if (typeof address !== 'undefined') data.address = address
    if (typeof website !== 'undefined') data.website = website
    if (typeof avatar !== 'undefined') data.avatar = avatar
    if (typeof company !== 'undefined') data.company = company
    if (typeof services !== 'undefined') data.services = services
    if (typeof isVisibleToClients !== 'undefined') data.isVisibleToClients = !!isVisibleToClients
    if (typeof acceptsJobOffers !== 'undefined') data.acceptsJobOffers = !!acceptsJobOffers
    if (typeof abn !== 'undefined') data.abn = abn
    const user = await prisma.user.update({ where: { id: userId }, data })
    const profile = {
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
    }
    return NextResponse.json({ success: true, profile }, { headers: cors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
  }
}
