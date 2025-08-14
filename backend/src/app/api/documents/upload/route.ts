import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const companyId = formData.get('companyId') as string

    if (!file) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'No file provided' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    if (!userId) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    // Validate file type
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}` },
        { 
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
    if (file.size > maxSize) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json(
        { error: `File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes` },
        { 
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)

    // Validate user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!userExists) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'User not found' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    // Validate company exists if companyId is provided
    if (companyId) {
      const companyExists = await prisma.company.findUnique({
        where: { id: companyId }
      })
      
      if (!companyExists) {
        const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
        return NextResponse.json({ error: 'Company not found' }, { 
          status: 404,
          headers: corsHeaders,
        })
      }
    }

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        fileName,
        originalName: file.name,
        filePath: `uploads/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        status: 'QUEUE',
        userId,
        companyId: companyId || null,
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

    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json({
      success: true,
      document,
      message: 'File uploaded successfully',
    }, {
      headers: corsHeaders,
    })
  } catch (error) {
    console.error('Upload error:', error)
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}