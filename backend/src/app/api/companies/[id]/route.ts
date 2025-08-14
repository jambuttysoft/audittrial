import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const existingCompany = await prisma.company.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingCompany) {
      return NextResponse.json({ error: 'Company not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      })
    }

    // Parse request body
    const body = await request.json()
    const { name, description, email, phone, address, website, abn, industry } = body

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        name: name || existingCompany.name,
        description: description !== undefined ? description : existingCompany.description,
        email: email !== undefined ? email : existingCompany.email,
        phone: phone !== undefined ? phone : existingCompany.phone,
        address: address !== undefined ? address : existingCompany.address,
        website: website !== undefined ? website : existingCompany.website,
        abn: abn !== undefined ? abn : existingCompany.abn,
        industry: industry !== undefined ? industry : existingCompany.industry,
        updatedAt: new Date(),
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
      ...updatedCompany,
      documentsCount: updatedCompany._count.documents,
      _count: undefined,
    }

    return NextResponse.json(transformedCompany, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
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

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}