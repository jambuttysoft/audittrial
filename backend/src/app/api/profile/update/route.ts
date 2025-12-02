import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  const baseHeaders = getCorsHeaders(origin)
  const headers = { ...baseHeaders, 'X-Request-Id': requestId }
  try {
    const body = await request.json()
    const { userId } = body || {}
    if (!userId) {
      return NextResponse.json({
        success: false,
        code: 'VALIDATION_ERROR',
        error: {
          type: 'ValidationError',
          details: [
            { field: 'userId', message: 'Required' }
          ]
        },
        message: 'Request validation failed',
        timestamp: new Date().toISOString(),
        requestId
      }, { status: 400, headers })
    }
    const data: any = {}
    const setStr = (k: string) => {
      if (body[k] !== undefined) {
        const v = typeof body[k] === 'string' ? body[k].trim() : body[k]
        data[k] = v === '' ? null : v
      }
    }
    const setBool = (k: string) => {
      if (body[k] !== undefined) data[k] = !!body[k]
    }
    setStr('name')
    if (body.userType !== undefined) data.userType = body.userType
    setStr('phone')
    setStr('address')
    setStr('website')
    setStr('avatar')
    setStr('company')
    setStr('services')
    setStr('abn')
    setBool('isVisibleToClients')
    setBool('acceptsJobOffers')
    setBool('autoChargeEnabled')

    const updated = await prisma.user.update({ where: { id: String(userId) }, data, select: {
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
    } })
    return NextResponse.json({
      success: true,
      code: 'SUCCESS',
      data: { profile: updated },
      message: 'Operation completed successfully',
      timestamp: new Date().toISOString(),
      requestId
    }, { headers })
  } catch (error) {
    return NextResponse.json({
      success: false,
      code: 'INTERNAL_ERROR',
      error: {
        type: 'InternalError'
      },
      message: 'Failed to update profile',
      timestamp: new Date().toISOString(),
      requestId
    }, { status: 500, headers })
  }
}
