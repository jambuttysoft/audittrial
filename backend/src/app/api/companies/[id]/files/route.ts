import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return handleCorsOptions(origin)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    // Verify company belongs to user
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        userId,
      },
    })

    if (!company) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'Company not found' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    // Get documents for the company
    const documents = await prisma.document.findMany({
      where: {
        companyId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    })

    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json({
      success: true,
      documents,
      company,
    }, {
      headers: {
        ...corsHeaders,
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
    })
  } catch (error) {
    console.error('Get company files error:', error)
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json(
      { error: 'Failed to get company files' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}