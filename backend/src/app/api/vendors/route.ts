import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { prisma } from '@/lib/prisma'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const abn = searchParams.get('abn') || ''
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')

  // Validate ABN
  if (!/^\d{11}$/.test(abn)) {
    return NextResponse.json(
      { error: 'Invalid ABN format. ABN must be 11 digits.' },
      { status: 400, headers: corsHeaders }
    )
  }

  try {
    const existing = await (prisma as any).vendor.findUnique({ where: { abn } })
    const isOutdated = existing?.requestUpdateDate
      ? (Date.now() - new Date(existing.requestUpdateDate).getTime()) > 1000 * 60 * 60 * 24 * 180
      : true

    let abnData: any = null

    if (!existing || isOutdated) {
      const apiKey = process.env.ABN_API_KEY
      if (!apiKey) {
        return NextResponse.json(
          { error: 'ABN API key not configured' },
          { status: 500, headers: corsHeaders }
        )
      }
      const abnApiUrl = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&callback=callback&guid=${apiKey}`
      const resp = await fetch(abnApiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/javascript',
          'User-Agent': 'AuditTrial-App/1.0',
        },
      })
      if (!resp.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch ABN data from government API' },
          { status: resp.status, headers: corsHeaders }
        )
      }
      const responseText = await resp.text()
      const match = responseText.match(/callback\((.+)\)$/)
      if (!match) {
        return NextResponse.json(
          { error: 'Invalid response format from ABN API' },
          { status: 500, headers: corsHeaders }
        )
      }
      abnData = JSON.parse(match[1])
      if (abnData.Message && abnData.Message.trim() !== '') {
        return NextResponse.json(
          { error: abnData.Message },
          { status: 400, headers: corsHeaders }
        )
      }

      // Upsert cache
      await (prisma as any).vendor.upsert({
        where: { abn },
        update: {
          abnStatus: abnData.AbnStatus || null,
          abnStatusEffectiveFrom: abnData.AbnStatusEffectiveFrom ? new Date(abnData.AbnStatusEffectiveFrom) : null,
          acn: abnData.Acn || null,
          addressDate: abnData.AddressDate ? new Date(abnData.AddressDate) : null,
          addressPostcode: abnData.AddressPostcode || null,
          addressState: abnData.AddressState || null,
          businessName: Array.isArray(abnData.BusinessName) ? abnData.BusinessName : null,
          entityName: abnData.EntityName || null,
          entityTypeCode: abnData.EntityTypeCode || null,
          entityTypeName: abnData.EntityTypeName || null,
          gst: abnData.Gst ? new Date(abnData.Gst) : null,
          message: abnData.Message || null,
          requestUpdateDate: new Date(),
        },
        create: {
          abn,
          abnStatus: abnData.AbnStatus || null,
          abnStatusEffectiveFrom: abnData.AbnStatusEffectiveFrom ? new Date(abnData.AbnStatusEffectiveFrom) : null,
          acn: abnData.Acn || null,
          addressDate: abnData.AddressDate ? new Date(abnData.AddressDate) : null,
          addressPostcode: abnData.AddressPostcode || null,
          addressState: abnData.AddressState || null,
          businessName: Array.isArray(abnData.BusinessName) ? abnData.BusinessName : null,
          entityName: abnData.EntityName || null,
          entityTypeCode: abnData.EntityTypeCode || null,
          entityTypeName: abnData.EntityTypeName || null,
          gst: abnData.Gst ? new Date(abnData.Gst) : null,
          message: abnData.Message || null,
          requestUpdateDate: new Date(),
        },
      })
    } else {
      // Build ABR-like shape from cache
      abnData = {
        Abn: existing.abn,
        AbnStatus: existing.abnStatus ?? '',
        AbnStatusEffectiveFrom: existing.abnStatusEffectiveFrom ? existing.abnStatusEffectiveFrom.toISOString().slice(0, 10) : '',
        Acn: existing.acn ?? '',
        AddressDate: existing.addressDate ? existing.addressDate.toISOString().slice(0, 10) : '',
        AddressPostcode: existing.addressPostcode ?? '',
        AddressState: existing.addressState ?? '',
        BusinessName: Array.isArray(existing.businessName as any) ? (existing.businessName as any) : [],
        EntityName: existing.entityName ?? '',
        EntityTypeCode: existing.entityTypeCode ?? '',
        EntityTypeName: existing.entityTypeName ?? '',
        Gst: existing.gst ? existing.gst.toISOString().slice(0, 10) : '',
        Message: existing.message ?? '',
      }
    }

    return NextResponse.json(abnData, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get vendor data' },
      { status: 500, headers: corsHeaders }
    )
  }
}
