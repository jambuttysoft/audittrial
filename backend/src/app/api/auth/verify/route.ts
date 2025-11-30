import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return handleCorsOptions(origin);
}

export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find user with this verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'Email already verified. You can now log in.' },
                { status: 200, headers: corsHeaders }
            );
        }

        // Update user to verified and clear token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null
            }
        });

        return NextResponse.json(
            {
                message: 'Email verified successfully! You can now log in.',
                verified: true
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('Verification error:', error);
        const origin = request.headers.get('origin');
        const corsHeaders = getCorsHeaders(origin);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
