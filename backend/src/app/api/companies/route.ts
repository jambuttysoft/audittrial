import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
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

    // Get companies for the user with document counts
    const companies = await prisma.company.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the expected format
    const transformedCompanies = companies.map(company => ({
      ...company,
      documentsCount: company._count.documents,
      _count: undefined,
    }))

    return NextResponse.json({
      success: true,
      companies: transformedCompanies,
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json(
      { error: 'Failed to get companies' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, email, phone, address, website, abn, industry, userId } = body

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Company name and user ID are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
          },
        }
      )
    }

    // Create new company
    const company = await prisma.company.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        website,
        abn,
        industry,
        userId,
      },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    })

    // Transform the data to match the expected format
    const transformedCompany = {
      ...company,
      documentsCount: company._count.documents,
      _count: undefined,
    }

    return NextResponse.json({
      success: true,
      company: transformedCompany,
      message: 'Company created successfully',
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
  } catch (error) {
    console.error('Create company error:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
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