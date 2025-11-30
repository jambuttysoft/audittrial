import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from 'xero-node'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

function getXeroClient() {
  const clientId = process.env.XERO_CLIENT_ID
  const clientSecret = process.env.XERO_CLIENT_SECRET
  const redirectUri = process.env.XERO_REDIRECT_URI
  const scopes = process.env.XERO_SCOPES?.split(' ') || []

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Xero environment variables')
  }

  return new XeroClient({ clientId, clientSecret, redirectUris: [redirectUri], scopes })
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
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
    return NextResponse.json({ error: 'Failed to fetch Xero organisations', details: error.message }, { status: 500, headers: corsHeaders })
  }
}

