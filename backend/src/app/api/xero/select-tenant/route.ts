import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  try {
    const body = await request.json()
    const { userId, companyId, tenantId, tenantName } = body || {}

    if (!userId || !companyId || !tenantId) {
      return NextResponse.json({ error: 'userId, companyId and tenantId are required' }, { status: 400, headers: corsHeaders })
    }

    // Ensure company belongs to user
    const company = await prisma.company.findUnique({ where: { id: companyId }, select: { userId: true } })
    if (!company || company.userId !== userId) {
      return NextResponse.json({ error: 'Company not found or access denied' }, { status: 404, headers: corsHeaders })
    }

    await prisma.company.update({
      where: { id: companyId },
      data: ({
        xeroTenantId: tenantId,
        xeroTenantName: tenantName || null,
      } as any),
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save selected organisation', details: error.message }, { status: 500, headers: corsHeaders })
  }
}
