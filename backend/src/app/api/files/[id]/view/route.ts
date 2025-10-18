import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
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
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'User ID is required' }, { 
        status: 400,
        headers: corsHeaders,
      })
    }

    // Find the document - check both Document and Digitized tables
    let document = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    })

    // If not found in Document table, check if it's a digitized document
    if (!document) {
      // Prefer ORM over raw SQL for MySQL compatibility
      const digitized =
        (await prisma.digitized.findFirst({
          where: { originalDocumentId: id, userId },
          select: { filePath: true, mimeType: true, originalName: true },
        })) ??
        (await prisma.digitized.findFirst({
          where: { id, userId },
          select: { filePath: true, mimeType: true, originalName: true },
        }))

      if (digitized) {
        document = {
          filePath: digitized.filePath,
          mimeType: digitized.mimeType,
          originalName: digitized.originalName,
        } as any
      }
    }

    if (!document) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'Document not found' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    if (!document.filePath) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'File path not found' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    // Check if file exists
    const fullPath = join(process.cwd(), document.filePath)
    if (!existsSync(fullPath)) {
      const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
      return NextResponse.json({ error: 'File not found on disk' }, { 
        status: 404,
        headers: corsHeaders,
      })
    }

    // Read file
    const fileBuffer = await readFile(fullPath)

    // Set appropriate headers
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', document.mimeType || 'application/octet-stream')
    headers.set('Content-Length', fileBuffer.length.toString())
    headers.set('Content-Disposition', `inline; filename="${document.originalName}"`)
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('View file error:', error)
    const corsHeaders = getCorsHeaders(request.headers.get('origin') || '')
    return NextResponse.json(
      { error: 'Failed to view file' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    )
  }
}