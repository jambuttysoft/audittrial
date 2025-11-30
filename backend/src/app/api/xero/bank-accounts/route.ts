import { NextRequest, NextResponse } from 'next/server'
import { XeroClient } from 'xero-node'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

function getXeroClient() {
  const clientId = process.env.XERO_CLIENT_ID
  const clientSecret = process.env.XERO_CLIENT_SECRET
  const redirectUri = process.env.XERO_REDIRECT_URI
  const scopes = process.env.XERO_SCOPES?.split(' ') || []
  if (!clientId || !clientSecret || !redirectUri) throw new Error('Missing Xero environment variables')
  return new XeroClient({ clientId, clientSecret, redirectUris: [redirectUri], scopes })
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || ''
    const companyId = searchParams.get('companyId') || ''
    if (!userId || !companyId) return NextResponse.json({ error: 'userId and companyId are required' }, { status: 400, headers: corsHeaders })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    const tenantId = (company as any)?.xeroTenantId as string | undefined
    if (!user || !user.xeroAccessToken) return NextResponse.json({ error: 'Xero not connected for user' }, { status: 401, headers: corsHeaders })
    if (!company || !tenantId) return NextResponse.json({ error: 'Company not linked to Xero tenant' }, { status: 400, headers: corsHeaders })

    const xero = getXeroClient()
    await xero.setTokenSet({ access_token: user.xeroAccessToken, refresh_token: user.xeroRefreshToken || undefined, expires_at: user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry).getTime() : undefined })
    const res = await xero.accountingApi.getAccounts(tenantId)
    const accounts = (res?.body?.accounts || []).filter((a: any) => a.status === 'ACTIVE' && a.type === 'BANK').map((a: any) => ({ accountID: a.accountID, code: a.code, name: a.name }))

    return NextResponse.json({ accounts }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch bank accounts', details: error.message }, { status: 500, headers: corsHeaders })
  }
}

