import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';
import jwt from 'jsonwebtoken';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return handleCorsOptions(origin);
}

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);

        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json(
                { error: 'Google credential is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Decode Google JWT token (in production, verify with Google's public keys)
        const decoded: any = jwt.decode(credential);

        if (!decoded || !decoded.email) {
            return NextResponse.json(
                { error: 'Invalid Google credential' },
                { status: 400, headers: corsHeaders }
            );
        }

        const { email, name, sub: googleId, picture } = decoded;

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            // User exists - log them in
            if (!user.isOAuthUser) {
                return NextResponse.json(
                    { error: 'This email is registered with password login. Please use password to sign in.' },
                    { status: 400, headers: corsHeaders }
                );
            }

            // Update user info if needed
            if (user.oauthProvider !== 'google' || user.oauthId !== googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        oauthProvider: 'google',
                        oauthId: googleId,
                        avatar: picture || user.avatar,
                        name: name || user.name
                    }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    isOAuthUser: true,
                    oauthProvider: 'google',
                    oauthId: googleId,
                    avatar: picture,
                    isVerified: true, // Google users are auto-verified
                    userType: 'INDIVIDUAL',
                    isActive: true,
                    isDeleted: false,
                    acceptsJobOffers: false
                }
            });
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
        );

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
                    avatar: user.avatar
                },
                token,
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('Google OAuth error:', error);
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
