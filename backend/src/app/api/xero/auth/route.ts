import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

// Initialize Xero client using environment variables
const getXeroClient = (state?: string) => {
  const client_id: string = process.env.XERO_CLIENT_ID!;
  const client_secret: string = process.env.XERO_CLIENT_SECRET!;
  const redirectUrl: string = process.env.XERO_REDIRECT_URI!;
  const envScopes: string = process.env.XERO_SCOPES || '';
  const base = envScopes ? envScopes.split(' ') : [];
  const required = ['openid','profile','email','offline_access','accounting.settings','accounting.transactions','accounting.contacts','accounting.attachments'];
  const set = new Set<string>([...base, ...required]);
  const scopes = Array.from(set);

  console.log('=== XERO AUTH CLIENT INITIALIZATION DEBUG ===');
  console.log('client_id:', client_id ? `${client_id.substring(0, 8)}...` : 'MISSING');
  console.log('client_secret:', client_secret ? `${client_secret.substring(0, 8)}...` : 'MISSING');
  console.log('redirectUrl:', redirectUrl);
  console.log('scopes:', scopes);
  console.log('XERO_SCOPES env var:', process.env.XERO_SCOPES);

  if (!client_id || !client_secret || !redirectUrl) {
    const error = `Environment Variables not all set - client_id=${!!client_id}, client_secret=${!!client_secret}, redirectUrl=${!!redirectUrl}`;
    console.error('ERROR:', error);
    throw Error(error);
  }

  const xeroConfig = {
    clientId: client_id,
    clientSecret: client_secret,
    redirectUris: [redirectUrl],
    scopes,
    state,
  };
  
  console.log('XeroClient auth config:', {
    ...xeroConfig,
    clientSecret: '[HIDDEN]'
  });

  try {
    const client = new XeroClient(xeroConfig);
    console.log('XeroClient for auth created successfully');
    return client;
  } catch (error) {
    console.error('Error creating XeroClient for auth:', error);
    throw error;
  }
};

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') }
      );
    }

    // Validate environment variables
    if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET || !process.env.XERO_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'Xero configuration is missing. Please check environment variables.' },
        { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
      );
    }

    const xero = getXeroClient(`userId=${userId}`);
    
    // Build consent URL (includes state from config)
    const consentUrl = await xero.buildConsentUrl();
    
    return NextResponse.json(
      { consentUrl },
      { headers: getCorsHeaders(request.headers.get('origin') || '') }
    );
  } catch (error) {
    console.error('Xero auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Xero authorization URL' },
      { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') }
    );
  }
}
