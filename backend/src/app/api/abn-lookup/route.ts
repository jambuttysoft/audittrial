import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const abn = searchParams.get('abn')
  
  const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
  
  if (!abn) {
    return NextResponse.json(
      { error: 'ABN parameter is required' },
      { status: 400, headers: corsHeaders }
    )
  }
  
  // Проверяем формат ABN (11 цифр)
  const abnRegex = /^\d{11}$/
  if (!abnRegex.test(abn)) {
    return NextResponse.json(
      { error: 'Invalid ABN format. ABN must be 11 digits.' },
      { status: 400, headers: corsHeaders }
    )
  }
  
  const apiKey = process.env.ABN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ABN API key not configured' },
      { status: 500, headers: corsHeaders }
    )
  }
  
  try {
    // Используем JSON ABN Lookup API
    const abnApiUrl = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&callback=callback&guid=${apiKey}`
    
    const response = await fetch(abnApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/javascript',
        'User-Agent': 'AuditTrial-App/1.0'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch ABN data from government API' },
        { status: response.status, headers: corsHeaders }
      )
    }
    
    const responseText = await response.text()
    
    // Парсим JSONP ответ (убираем callback())
    const jsonMatch = responseText.match(/callback\((.+)\)$/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Invalid response format from ABN API' },
        { status: 500, headers: corsHeaders }
      )
    }
    
    const abnData = JSON.parse(jsonMatch[1])
    
    // Проверяем наличие ошибок
    if (abnData.Message && abnData.Message.trim() !== '') {
      return NextResponse.json(
        { error: abnData.Message },
        { status: 400, headers: corsHeaders }
      )
    }
    
    return NextResponse.json(abnData, { headers: corsHeaders })
    
  } catch (error) {
    console.error('Error fetching ABN data:', error)
    return NextResponse.json(
      { error: 'Internal server error while fetching ABN data' },
      { status: 500, headers: corsHeaders }
    )
  }
}