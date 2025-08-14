import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
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
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
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
      return NextResponse.json({ error: 'Company not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
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

    return NextResponse.json({
      success: true,
      documents,
      company,
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
    })
  } catch (error) {
    console.error('Get company files error:', error)
    return NextResponse.json(
      { error: 'Failed to get company files' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}