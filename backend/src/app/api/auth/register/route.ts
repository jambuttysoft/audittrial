import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3111',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
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
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // For non-OAuth users, password is required
    if (!isOAuthUser && !password) {
      return NextResponse.json(
        { error: 'Пароль обязателен' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // For OAuth users, provider and ID are required
    if (isOAuthUser && (!oauthProvider || !oauthId)) {
      return NextResponse.json(
        { error: 'OAuth провайдер и ID обязательны для OAuth регистрации' },
        { status: 400 }
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
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
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
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3111',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3111',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}