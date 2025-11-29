import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';
import { generateToken, sendVerificationEmail } from '@/lib/email';

interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  userType: 'INDIVIDUAL' | 'BUSINESS';
  phone?: string;
  company?: string;
  services?: string;
  acceptsJobOffers?: boolean;
  // OAuth fields
  isOAuthUser?: boolean;
  oauthProvider?: string;
  oauthId?: string;
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

    console.log('📝 Registration Request Received')

    const body: RegisterRequest = await request.json();
    const {
      email,
      password,
      name,
      userType,
      phone,
      company,
      services,
      acceptsJobOffers,
      isOAuthUser = false,
      oauthProvider,
      oauthId
    } = body;

    // Validate required fields
    if (!email || !name || !userType) {
      return NextResponse.json(
        { error: 'Email, name, and user type are required' },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // For non-OAuth users, password is required
    if (!isOAuthUser && !password) {
      return NextResponse.json(
        { error: 'Password is required' },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // For OAuth users, provider and ID are required
    if (isOAuthUser && (!oauthProvider || !oauthId)) {
      return NextResponse.json(
        { error: 'OAuth provider and ID are required for OAuth registration' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        {
          status: 409,
          headers: corsHeaders
        }
      );
    }

    // Hash password for non-OAuth users
    let hashedPassword = null;
    if (!isOAuthUser && password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Generate verification token for non-OAuth users
    const verificationToken = isOAuthUser ? null : generateToken();

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType,
        phone,
        company,
        services,
        isOAuthUser,
        oauthProvider,
        oauthId,
        isActive: true,
        isDeleted: false,
        isVerified: isOAuthUser, // OAuth users are auto-verified
        verificationToken,
        acceptsJobOffers: acceptsJobOffers ?? (userType === 'BUSINESS')
      },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        phone: true,
        company: true,
        services: true,
        isOAuthUser: true,
        oauthProvider: true,
        acceptsJobOffers: true,
        isActive: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Send verification email for non-OAuth users
    if (!isOAuthUser && verificationToken) {
      console.log(`📧 Triggering verification email for: ${email}`)
      const emailResult = await sendVerificationEmail(email, verificationToken);
      console.log('📧 Verification email result:', emailResult)
    }

    // Automatically create a company if user is BUSINESS type or company name is provided
    let createdCompany = null;
    if (userType === 'BUSINESS' || company) {
      const companyName = company || `${name}'s Company`;

      try {
        createdCompany = await prisma.company.create({
          data: {
            name: companyName,
            description: services || undefined,
            email: email,
            phone: phone || undefined,
            userId: newUser.id,
            isActive: true
          },
          select: {
            id: true,
            name: true,
            description: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true
          }
        });
      } catch (companyError) {
        console.error('Company creation error:', companyError);
        // Don't fail the registration if company creation fails
      }
    }

    return NextResponse.json({
      message: isOAuthUser
        ? 'User registered successfully'
        : 'Registration successful! Please check your email to verify your account.',
      user: newUser,
      company: createdCompany,
      requiresVerification: !isOAuthUser
    }, {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Registration error:', error);
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}