import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return handleCorsOptions(origin);
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: corsHeaders
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
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Get companies error:', error)
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json(
      { error: 'Failed to get companies' },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const body = await request.json()
    const { name, description, email, phone, address, website, abn, industry, userId } = body

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Company name and user ID are required' },
        { 
          status: 400,
          headers: corsHeaders
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
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Create company error:', error)
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}