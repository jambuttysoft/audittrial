import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3111',
        'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
  });
}

// Get Xero connection status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        xeroAccessToken: true,
        xeroTokenExpiry: true,
        xeroTenantId: true,
        xeroTenantName: true,
        xeroConnectedAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const isConnected = !!(user.xeroAccessToken && user.xeroTenantId);
    const isTokenExpired = user.xeroTokenExpiry ? new Date() > user.xeroTokenExpiry : true;
    
    return NextResponse.json(
      {
        isConnected,
        isTokenExpired,
        tenantName: user.xeroTenantName,
        connectedAt: user.xeroConnectedAt,
        needsReconnection: isConnected && isTokenExpired
      },
      {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3111',
          'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('Xero status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check Xero status' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3111',
          'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Disconnect Xero
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3111',
            'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Clear Xero tokens and tenant info
    await prisma.user.update({
      where: { id: userId },
      data: {
        xeroAccessToken: null,
        xeroRefreshToken: null,
        xeroTokenExpiry: null,
        xeroTenantId: null,
        xeroTenantName: null,
        // Keep xeroConnectedAt for historical reference
      }
    });
    
    return NextResponse.json(
      { message: 'Xero disconnected successfully' },
      {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3111',
          'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('Xero disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Xero' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3111',
          'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}