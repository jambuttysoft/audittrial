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
    userId = searchParams.get('userId') || ''
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
    const accountsRaw = (res?.body?.accounts || [])
    const accounts = accountsRaw
      .filter((a: any) => a.status === 'ACTIVE' && a.code && (String(a._class).toUpperCase() === 'ASSET') && (String(a.type || '').toUpperCase().includes('CURRENT')))
      .map((a: any) => ({ accountID: a.accountID, code: a.code, name: a.name, type: a.type }))

    return NextResponse.json({ accounts }, { headers: corsHeaders })
  } catch (error: any) {
    console.error('Xero current asset accounts error:', error)

    const isAuthError = error.response?.status === 401 ||
      error.message?.includes('invalid_grant') ||
      error.message?.includes('unauthorized') ||
      JSON.stringify(error).includes('invalid_grant')

    if (isAuthError && userId) {
      try { await disconnectXero(userId) } catch {}
      return NextResponse.json({ error: 'Xero session expired. Please reconnect.', disconnected: true }, { status: 401, headers: corsHeaders })
    }

    return NextResponse.json({ error: 'Failed to fetch current asset accounts', details: error.message }, { status: 500, headers: corsHeaders })
  }
}
