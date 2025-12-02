import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { getXeroClient, disconnectXero } from '@/lib/xero'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  let userId: string | null = null
  try {
    const { searchParams } = new URL(request.url)
    userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xeroAccessToken: true,
        xeroRefreshToken: true,
        xeroTokenExpiry: true,
      },
    })

    if (!user || !user.xeroAccessToken) {
      return NextResponse.json({ error: 'Not connected to Xero' }, { status: 401, headers: corsHeaders })
    }

    const xero = getXeroClient()
    await xero.setTokenSet({
      access_token: user.xeroAccessToken!,
      refresh_token: user.xeroRefreshToken || undefined,
      expires_at: user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry).getTime() : undefined,
    })

    await xero.updateTenants()
    const tenants = (xero.tenants || []).map(t => ({
      tenantId: t.tenantId,
      tenantName: t.tenantName,
      tenantType: t.tenantType,
    }))

    return NextResponse.json({ tenants }, { headers: corsHeaders })
  } catch (error: any) {
    console.error('Xero organisations error:', error)

    // Check for authentication errors and disconnect if necessary
    // Xero often returns 401 or "invalid_grant"
    // The error object from xero-node often has response.status or body.Status
    const isAuthError = error.response?.status === 401 ||
      error.body?.Status === 401 ||
      error.statusCode === 401 ||
      error.message?.includes('invalid_grant') ||
      error.message?.includes('unauthorized') ||
      error.message?.includes('TokenExpired') ||
      JSON.stringify(error).includes('invalid_grant') ||
      JSON.stringify(error).includes('TokenExpired');

    if (isAuthError && userId) {
      console.log(`Disconnecting user ${userId} due to Xero auth error`)
      await disconnectXero(userId)
      return NextResponse.json({ error: 'Xero session expired. Please reconnect.', disconnected: true }, { status: 401, headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Failed to fetch Xero organisations', details: error.message }, { status: 500, headers: corsHeaders })
  }
}

