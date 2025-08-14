import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';

interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  userType: 'INDIVIDUAL' | 'BUSINESS';
  phone?: string;
  company?: string;
  services?: string;
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
    
    const body: RegisterRequest = await request.json();
    const { 
      email, 
      password, 
      name, 
      userType, 
      phone, 
      company, 
      services,
      isOAuthUser = false,
      oauthProvider,
      oauthId
    } = body;

    // Validate required fields
    if (!email || !name || !userType) {
      return NextResponse.json(
        { error: 'Email, имя и тип пользователя обязательны' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // For non-OAuth users, password is required
    if (!isOAuthUser && !password) {
      return NextResponse.json(
        { error: 'Пароль обязателен' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // For OAuth users, provider and ID are required
    if (isOAuthUser && (!oauthProvider || !oauthId)) {
      return NextResponse.json(
        { error: 'OAuth провайдер и ID обязательны для OAuth регистрации' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
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
        isVisibleToClients: userType === 'BUSINESS',
        acceptsJobOffers: userType === 'BUSINESS'
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
        isVisibleToClients: true,
        acceptsJobOffers: true,
        isActive: true,
        createdAt: true
      }
    });

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
      message: 'Пользователь успешно зарегистрирован',
      user: newUser,
      company: createdCompany
    }, { 
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Registration error:', error);
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}