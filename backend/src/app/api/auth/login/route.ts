import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

// Request/Response interfaces
interface LoginRequest {
  email: string
  password?: string
  isOAuthUser?: boolean
  oauthProvider?: string
  oauthId?: string
}

interface LoginResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string | null
    userType: string
    isOAuthUser: boolean
  }
  token?: string
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return handleCorsOptions(origin);
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    const { email, password, isOAuthUser = false, oauthProvider, oauthId }: LoginRequest = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' } as LoginResponse,
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // For OAuth users, validate OAuth fields
    if (isOAuthUser && (!oauthProvider || !oauthId)) {
      return NextResponse.json(
        { success: false, message: 'OAuth provider and ID are required for OAuth login' } as LoginResponse,
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // For regular users, validate password
    if (!isOAuthUser && !password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' } as LoginResponse,
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        userType: true,
        isOAuthUser: true,
        oauthProvider: true,
        oauthId: true,
        isActive: true,
        isDeleted: true,
        isVerified: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' } as LoginResponse,
        {
          status: 404, // Changed to 404 for specific error
          headers: corsHeaders
        }
      )
    }

    // Check if user account is active
    if (!user.isActive || user.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' } as LoginResponse,
        {
          status: 401,
          headers: corsHeaders
        }
      )
    }

    // Check if email is verified (for non-OAuth users)
    if (!user.isOAuthUser && !user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email address before logging in. Check your inbox for the verification link.' } as LoginResponse,
        {
          status: 403,
          headers: corsHeaders
        }
      )
    }

    // Handle OAuth login
    if (isOAuthUser) {
      if (!user.isOAuthUser || user.oauthProvider !== oauthProvider || user.oauthId !== oauthId) {
        return NextResponse.json(
          { success: false, message: 'Invalid OAuth credentials' } as LoginResponse,
          {
            status: 401,
            headers: corsHeaders
          }
        )
      }
    } else {
      // Handle regular password login
      if (user.isOAuthUser || !user.password) {
        return NextResponse.json(
          { success: false, message: 'This account uses OAuth login' } as LoginResponse,
          {
            status: 401,
            headers: corsHeaders
          }
        )
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password!, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' } as LoginResponse,
          {
            status: 401,
            headers: corsHeaders
          }
        )
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    )

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          isOAuthUser: user.isOAuthUser,
        },
        token,
      } as LoginResponse,
      {
        status: 200,
        headers: corsHeaders
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json(
      { success: false, message: 'Internal server error' } as LoginResponse,
      {
        status: 500,
        headers: corsHeaders
      }
    )
  }
}