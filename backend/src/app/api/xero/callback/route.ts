import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { prisma } from '@/lib/prisma';
import { jwtDecode } from 'jwt-decode';
import { XeroAccessToken, XeroIdToken, TokenSet } from 'xero-node';

// Initialize Xero client using environment variables
const getXeroClient = () => {
  const client_id: string = process.env.XERO_CLIENT_ID!;
  const client_secret: string = process.env.XERO_CLIENT_SECRET!;
  const redirectUrl: string = process.env.XERO_REDIRECT_URI!;
  const scopes: string = process.env.XERO_SCOPES || 'openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access';

  console.log('=== XERO CALLBACK CLIENT INITIALIZATION DEBUG ===');
  console.log('client_id:', client_id ? `${client_id.substring(0, 8)}...` : 'MISSING');
  console.log('client_secret:', client_secret ? `${client_secret.substring(0, 8)}...` : 'MISSING');
  console.log('redirectUrl:', redirectUrl);
  console.log('scopes:', scopes.split(' '));
  console.log('XERO_SCOPES env var:', process.env.XERO_SCOPES);

  if (!client_id || !client_secret || !redirectUrl) {
    const error = `Environment Variables not all set - please check your .env file in the project root or create one! client_id=${!!client_id}, client_secret=${!!client_secret}, redirectUrl=${!!redirectUrl}`;
    console.error('ERROR:', error);
    throw Error(error);
  }

  const xeroConfig = {
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes: scopes.split(' '),
  };
  
  console.log('XeroClient callback config:', {
    ...xeroConfig,
    clientSecret: '[HIDDEN]'
  });

  try {
    const client = new XeroClient(xeroConfig);
    console.log('XeroClient for callback created successfully');
    return client;
  } catch (error) {
    console.error('Error creating XeroClient for callback:', error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle authorization errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Authorization failed';
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent(errorDescription)}`
      );
    }
    
    if (!code || !state) {
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('Missing authorization code or state')}`
      );
    }
    
    // Extract user ID from state
    const userIdMatch = state.match(/userId=([^&]+)/);
    if (!userIdMatch) {
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('Invalid state parameter')}`
      );
    }
    
    const userId = decodeURIComponent(userIdMatch[1]);
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        xeroConnectedAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('User not found')}`
      );
    }
    
    console.log('=== XERO CALLBACK PROCESS DEBUG ===');
    console.log('Callback URL:', request.url);
    console.log('Code:', code);
    console.log('State:', state);
    console.log('User ID:', userId);
    
    const xero = getXeroClient();
    
    // Exchange code for tokens (following the Express.js pattern)
    console.log('Exchanging code for tokens...');
    const tokenSet: TokenSet = await xero.apiCallback(request.url);
    console.log('Token exchange successful, tokenSet keys:', Object.keys(tokenSet));
    console.log('Access token present:', !!tokenSet.access_token);
    console.log('Refresh token present:', !!tokenSet.refresh_token);
    console.log('ID token present:', !!tokenSet.id_token);
    
    console.log('Updating tenants...');
    await xero.updateTenants();
    console.log('Tenants updated, count:', xero.tenants?.length || 0);
    console.log('Tenants:', xero.tenants?.map(t => ({ id: t.tenantId, name: t.tenantName, type: t.tenantType })));

    console.log('Decoding tokens...');
    const decodedIdToken: XeroIdToken = jwtDecode(tokenSet.id_token!);
    const decodedAccessToken: XeroAccessToken = jwtDecode(tokenSet.access_token!);
    console.log('Tokens decoded successfully');
    console.log('ID token sub:', decodedIdToken.sub);
    console.log('Access token sub:', decodedAccessToken.sub);
    
    if (!tokenSet.access_token || !tokenSet.refresh_token) {
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('Failed to obtain tokens')}`
      );
    }
    
    // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
    const activeTenant = xero.tenants[0];
    
    if (!activeTenant) {
      return NextResponse.redirect(
        `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('No active Xero organisation found')}`
      );
    }
    
    // Calculate token expiry
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + (tokenSet.expires_in || 1800));
    
    // Update user with Xero tokens and tenant info
    await prisma.user.update({
      where: { id: userId },
      data: {
        xeroAccessToken: tokenSet.access_token,
        xeroRefreshToken: tokenSet.refresh_token,
        xeroTokenExpiry: expiryDate,
        xeroTenantId: activeTenant.tenantId,
        xeroTenantName: activeTenant.tenantName,
        xeroConnectedAt: user.xeroConnectedAt || new Date(),
      }
    });
    
    // Log authentication data (following Express.js pattern)
    const authData = {
      decodedIdToken,
      decodedAccessToken,
      tokenSet,
      allTenants: xero.tenants,
      activeTenant
    };
    console.log(authData);
    
    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      `http://localhost:3111/dashboard?xero_success=${encodeURIComponent('Xero connected successfully')}`
    );
    
  } catch (error) {
    console.error('Xero callback error:', error);
    return NextResponse.redirect(
      `http://localhost:3111/dashboard?xero_error=${encodeURIComponent('Failed to connect to Xero')}`
    );
  }
}