import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';
import { generateToken, sendPasswordResetEmail } from '@/lib/email';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return handleCorsOptions(origin);
}

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Always return success to prevent email enumeration
        if (!user || user.isOAuthUser) {
            return NextResponse.json(
                { message: 'If an account exists with this email, a password reset link has been sent.' },
                { status: 200, headers: corsHeaders }
            );
        }

        // Generate reset token and expiry (1 hour)
        const resetToken = generateToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Update user with reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // Send password reset email
        await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json(
            { message: 'If an account exists with this email, a password reset link has been sent.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
