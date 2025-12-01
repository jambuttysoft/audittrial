import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function ok(data: any, status = 200, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: true, code: 'SUCCESS', data, message: 'Operation completed successfully', timestamp: new Date().toISOString(), requestId }, { status, headers })
}

function badRequest(message: string, details?: any, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', error: { type: 'ValidationError', details }, message, timestamp: new Date().toISOString(), requestId }, { status: 400, headers })
}

function forbidden(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'FORBIDDEN', message, timestamp: new Date().toISOString(), requestId }, { status: 403, headers })
}

function serverError(message: string, headers?: Record<string,string>, requestId?: string) {
  return NextResponse.json({ success: false, code: 'INTERNAL_ERROR', message, timestamp: new Date().toISOString(), requestId }, { status: 500, headers })
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('userId') || ''
    const limitParam = Number(searchParams.get('limit') || 20)
    const offsetParam = Number(searchParams.get('offset') || 0)
    const limit = Math.min(Math.max(limitParam, 1), 100)
    const offset = Math.max(offsetParam, 0)

    if (!adminId) return badRequest('userId required', [{ field: 'userId', message: 'Required' }], corsHeaders, requestId)
    const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { role: true } })
    if (!admin || (admin.role !== 'ADMIN')) return forbidden('Admin role required', corsHeaders, requestId)

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: { id: true, email: true, name: true, role: true, isActive: true }
      }),
      prisma.user.count(),
    ])

    return ok({ users, total, limit, offset }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('GET /api/admin/users/roles error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to list users', corsHeaders, requestId)
  }
}

export async function PATCH(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))
  const requestId = request.headers.get('x-request-id') || `req_${Math.random().toString(36).slice(2)}`
  try {
    const body = await request.json()
    const { userId, targetUserId, role } = body || {}
    if (!userId || !targetUserId || !role) {
      return badRequest('Required fields missing', [
        { field: 'userId', message: 'Required' },
        { field: 'targetUserId', message: 'Required' },
        { field: 'role', message: 'Required' },
      ], corsHeaders, requestId)
    }

    const admin = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (!admin || (admin.role !== 'ADMIN')) return forbidden('Admin role required', corsHeaders, requestId)

    const allowed = new Set(['ADMIN','SUPPORT','USER','GUEST'])
    if (!allowed.has(String(role))) {
      return badRequest('Invalid role', [{ field: 'role', message: 'Must be one of ADMIN,SUPPORT,USER,GUEST' }], corsHeaders, requestId)
    }

    const updated = await prisma.user.update({ where: { id: String(targetUserId) }, data: { role: role as any }, select: { id: true, email: true, name: true, role: true } })
    return ok({ user: updated }, 200, corsHeaders, requestId)
  } catch (error: any) {
    console.error('PATCH /api/admin/users/roles error', { message: error?.message, stack: error?.stack })
    return serverError('Failed to update role', corsHeaders, requestId)
  }
}

