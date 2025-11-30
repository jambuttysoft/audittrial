import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'
import { generateToken, sendVerificationEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LAST_SEND_WINDOW_MS = 5 * 60 * 1000
const lastSendMap = new Map<string, number>()
const ipLastMap = new Map<string, number>()

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return handleCorsOptions(origin)
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const now = Date.now()
    const ipHeader = request.headers.get('x-forwarded-for')
    const ip = (ipHeader ? ipHeader.split(',')[0].trim() : null)
      || request.headers.get('x-real-ip')
      || request.headers.get('cf-connecting-ip')
      || 'unknown'
    const ipLast = ipLastMap.get(ip) || 0
    if (now - ipLast < LAST_SEND_WINDOW_MS) {
      const retryAfter = Math.ceil((LAST_SEND_WINDOW_MS - (now - ipLast)) / 1000)
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Too many requests', retryAfter }),
        { status: 429, headers: { ...corsHeaders, 'Retry-After': String(retryAfter) } }
      )
    }
    const last = lastSendMap.get(email) || 0
    if (now - last < LAST_SEND_WINDOW_MS) {
      const retryAfter = Math.ceil((LAST_SEND_WINDOW_MS - (now - last)) / 1000)
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Too many requests', retryAfter, retryAt: new Date(last + LAST_SEND_WINDOW_MS).toISOString() }),
        { status: 429, headers: { ...corsHeaders, 'Retry-After': String(retryAfter) } }
      )
    }

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, isVerified: true } })

    if (!user) {
      console.warn('Resend verification attempted for non-existent email', { email })
      lastSendMap.set(email, now)
      return NextResponse.json(
        { success: true, message: 'If the account exists, a verification email has been sent.' },
        { status: 200, headers: corsHeaders }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified.' },
        { status: 200, headers: corsHeaders }
      )
    }

    const token = generateToken()
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken: token } })

    const emailResult = await sendVerificationEmail(email, token)
    console.info('Verification resend result', { email, ok: emailResult.success, ip })

    lastSendMap.set(email, now)
    ipLastMap.set(ip, now)

    return NextResponse.json(
      { success: true, message: 'Verification email sent.' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Resend verification error', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
