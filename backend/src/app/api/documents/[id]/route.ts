import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function DELETE(
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

    // Find the document
    const document = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      })
    }

    // Delete file from disk if it exists
    if (document.filePath) {
      const fullPath = join(process.cwd(), document.filePath)
      if (existsSync(fullPath)) {
        try {
          await unlink(fullPath)
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
    }

    // Delete document record from database
    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
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

export async function GET(
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

    // Find the document
    const document = await prisma.document.findFirst({
      where: {
        id,
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
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      })
    }

    return NextResponse.json({
      success: true,
      document,
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Failed to get document' },
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