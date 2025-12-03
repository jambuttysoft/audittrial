import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { getXeroClient, disconnectXero } from '@/lib/xero'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

function getErrorMessage(err: any) {
  const r = err?.response
  const d = r?.body || r?.data
  if (typeof d === 'string') return d
  const elements = d?.Elements || d?.elements
  if (Array.isArray(elements) && elements.length) {
    const v = elements[0]?.ValidationErrors || elements[0]?.validationErrors
    if (Array.isArray(v) && v.length) {
      const msgs = v.map((x: any) => x?.Message || x?.message).filter(Boolean)
      if (msgs.length) return msgs.join('; ')
    }
  }
  const m = err?.message || err?.toString?.()
  if (m && m !== '[object Object]') return m
  try { return JSON.stringify(d || err) } catch { return 'Unknown error' }
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  let userId: string | null = null
  try {
    const body = await request.json()
    userId = body?.userId || ''
    const companyId = body?.companyId || ''
    const code = String(body?.code || '').trim()
    const name = String(body?.name || '').trim()
    const type = String(body?.type || '').trim().toUpperCase()
    const description = typeof body?.description === 'string' ? body.description : undefined

    if (!userId || !companyId || !code || !name || !type) {
      return NextResponse.json({ error: 'userId, companyId, code, name and type are required' }, { status: 400, headers: corsHeaders })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const company = await prisma.company.findUnique({ where: { id: companyId } })
    const tenantId = (company as any)?.xeroTenantId as string | undefined

    if (!user || !user.xeroAccessToken) {
      return NextResponse.json({ error: 'Xero not connected for user' }, { status: 401, headers: corsHeaders })
    }
    if (!company || !tenantId) {
      return NextResponse.json({ error: 'Company not linked to Xero tenant' }, { status: 400, headers: corsHeaders })
    }

    const xero = getXeroClient()
    await xero.setTokenSet({
      access_token: user.xeroAccessToken,
      refresh_token: user.xeroRefreshToken || undefined,
      expires_at: user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry).getTime() : undefined,
    })

    const idempotencyKey = Math.random().toString(36).slice(2)
    const account: any = { code, name, type }
    if (description) account.description = description

    const resp = await xero.accountingApi.createAccount(tenantId, account, idempotencyKey)
    const created = resp?.body?.accounts?.[0] || resp?.body || null

    return NextResponse.json({ success: true, account: created }, { status: 201, headers: corsHeaders })
  } catch (error: any) {
    const isAuthError = error?.response?.status === 401 ||
      error?.message?.includes('invalid_grant') ||
      error?.message?.includes('unauthorized') ||
      JSON.stringify(error || {}).includes('invalid_grant')

    if (isAuthError && userId) {
      try { await disconnectXero(userId) } catch {}
      return NextResponse.json({ error: 'Xero session expired. Please reconnect.', disconnected: true }, { status: 401, headers: corsHeaders })
    }

    const msg = getErrorMessage(error)
    return NextResponse.json({ error: 'Failed to create account', details: msg }, { status: 500, headers: corsHeaders })
  }
}
