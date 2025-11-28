import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return handleCorsOptions(origin);
}

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);

        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find user with this reset token
        const user = await prisma.user.findUnique({
            where: { resetToken: token }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Check if token is expired
        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new password reset.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json(
            { message: 'Password reset successfully. You can now log in with your new password.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
