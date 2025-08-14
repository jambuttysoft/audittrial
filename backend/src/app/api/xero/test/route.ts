import { NextRequest, NextResponse } from 'next/server'
import { XeroClient, AccountingApi } from 'xero-node'
import { prisma } from '@/lib/prisma'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

function getXeroClient() {
  const clientId = process.env.XERO_CLIENT_ID
  const clientSecret = process.env.XERO_CLIENT_SECRET
  const redirectUri = process.env.XERO_REDIRECT_URI
  const scopes = process.env.XERO_SCOPES?.split(' ') || []

  console.log('=== XERO CLIENT INITIALIZATION DEBUG ===')
  console.log('clientId:', clientId ? `${clientId.substring(0, 8)}...` : 'MISSING')
  console.log('clientSecret:', clientSecret ? `${clientSecret.substring(0, 8)}...` : 'MISSING')
  console.log('redirectUri:', redirectUri)
  console.log('scopes:', scopes)
  console.log('XERO_SCOPES env var:', process.env.XERO_SCOPES)

  if (!clientId || !clientSecret || !redirectUri) {
    const error = `Missing Xero environment variables: clientId=${!!clientId}, clientSecret=${!!clientSecret}, redirectUri=${!!redirectUri}`
    console.error('ERROR:', error)
    throw new Error(error)
  }

  const xeroConfig = {
    clientId,
    clientSecret,
    redirectUris: [redirectUri],
    scopes,
  }
  
  console.log('XeroClient config:', {
    ...xeroConfig,
    clientSecret: clientSecret ? '[HIDDEN]' : 'MISSING'
  })

  try {
    const client = new XeroClient(xeroConfig)
    console.log('XeroClient created successfully')
    return client
  } catch (error) {
    console.error('Error creating XeroClient:', error)
    throw error
  }
}

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('=== XERO TEST ENDPOINT DEBUG ===')
    console.log('userId:', userId)

    // Test XeroClient initialization first
    console.log('\n=== TESTING XERO CLIENT INITIALIZATION ===')
    try {
      const testXero = getXeroClient()
      console.log('XeroClient initialization test: SUCCESS')
    } catch (error) {
      console.log('XeroClient initialization test: FAILED')
      console.error('XeroClient error:', error)
    }
    console.log('=== END XERO CLIENT TEST ===\n')

    if (!userId) {
      console.log('ERROR: No userId provided')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's Xero tokens from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xeroAccessToken: true,
        xeroRefreshToken: true,
        xeroTokenExpiry: true,
        xeroTenantId: true,
        xeroTenantName: true,
      },
    })

    console.log('User found:', !!user)
    console.log('User xeroAccessToken:', user?.xeroAccessToken ? `${user.xeroAccessToken.substring(0, 10)}...` : 'MISSING')
    console.log('User xeroRefreshToken:', user?.xeroRefreshToken ? `${user.xeroRefreshToken.substring(0, 10)}...` : 'MISSING')
    console.log('User xeroTenantId:', user?.xeroTenantId)
    console.log('User xeroTenantName:', user?.xeroTenantName)
    console.log('User xeroTokenExpiry:', user?.xeroTokenExpiry)

    if (!user || !user.xeroAccessToken || !user.xeroTenantId) {
      console.log('ERROR: User not connected to Xero or missing tokens')
      console.log('Missing:', {
        user: !user,
        xeroAccessToken: !user?.xeroAccessToken,
        xeroTenantId: !user?.xeroTenantId
      })
      return NextResponse.json(
        { error: 'User not connected to Xero or missing tokens' },
        { status: 401 }
      )
    }

    // Check if token is expired
    const now = new Date()
    const tokenExpiry = user.xeroTokenExpiry ? new Date(user.xeroTokenExpiry) : null
    
    if (tokenExpiry && now >= tokenExpiry) {
      return NextResponse.json(
        { error: 'Xero token has expired. Please reconnect.' },
        { status: 401 }
      )
    }

    // Initialize Xero client
    const xero = getXeroClient()
    
    // Set the access token
    await xero.setTokenSet({
      access_token: user.xeroAccessToken,
      refresh_token: user.xeroRefreshToken || undefined,
      expires_at: tokenExpiry?.getTime(),
    })

    // Create accounting API instance
    const accountingApi = xero.accountingApi

    // Fetch accounts from Xero
    const accountsResponse = await accountingApi.getAccounts(
      user.xeroTenantId
    )

    const accounts = accountsResponse.body.accounts || []

    return NextResponse.json({
      success: true,
      tenantId: user.xeroTenantId,
      tenantName: user.xeroTenantName,
      accountsCount: accounts.length,
      accounts: accounts.map(account => ({
        accountID: account.accountID,
        code: account.code,
        name: account.name,
        type: account.type,
        status: account.status,
        description: account.description,
        class: account._class,
        systemAccount: account.systemAccount,
        enablePaymentsToAccount: account.enablePaymentsToAccount,
        showInExpenseClaims: account.showInExpenseClaims,
        bankAccountNumber: account.bankAccountNumber,
        bankAccountType: account.bankAccountType,
        currencyCode: account.currencyCode,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching Xero accounts:', error)
    
    // Handle specific Xero API errors
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message
      
      if (status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid or expired Xero token' },
          { status: 401 }
        )
      } else if (status === 403) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient permissions for Xero API' },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          { error: `Xero API error: ${message}` },
          { status: status }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch accounts from Xero', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}