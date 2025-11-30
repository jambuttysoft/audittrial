import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { prisma } from '@/lib/prisma';
import { jwtDecode } from 'jwt-decode';
import { XeroAccessToken, XeroIdToken, TokenSet } from 'xero-node';

// Initialize Xero client using environment variables
const getXeroClient = (state?: string) => {
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
    state,
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3646'
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'Authorization failed';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(errorDescription)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    if (!code || !state) {
      const msg = 'Missing authorization code or state';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // Extract user ID from state
    const userIdMatch = state.match(/userId=([^&]+)/);
    if (!userIdMatch) {
      const msg = 'Invalid state parameter';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
      const msg = 'User not found';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    console.log('=== XERO CALLBACK PROCESS DEBUG ===');
    console.log('Callback URL:', request.url);
    console.log('Code:', code);
    console.log('State:', state);
    console.log('User ID:', userId);
    
    const xero = getXeroClient(state || undefined);
    
    // Ensure client is initialized before callback
    await xero.initialize();
    
    // Exchange code for tokens
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
      const msg = 'Failed to obtain tokens';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    
    // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
    const activeTenant = xero.tenants[0];
    
    if (!activeTenant) {
      const msg = 'No active Xero organisation found';
      const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
    
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/></head><body><script>(function(){var d={type:'xero-auth',status:'success',message:'Xero connected successfully'};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    
  } catch (error: any) {
    console.error('Xero callback error:', error);
    const msg = error?.message || 'Failed to connect to Xero';
    const html = `<!doctype html><html><head><meta charset="utf-8"/></head><body><script>(function(){var d={type:'xero-auth',status:'error',message:${JSON.stringify(msg)}};try{window.opener&&window.opener.postMessage(d,'*')}catch(e){}window.close();setTimeout(function(){document.body.innerText='You can close this window.'},100)})();</script></body></html>`;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
