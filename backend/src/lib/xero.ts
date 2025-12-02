import { XeroClient } from 'xero-node'
import { prisma } from '@/lib/prisma'

export function getXeroClient() {
    const clientId = process.env.XERO_CLIENT_ID
    const clientSecret = process.env.XERO_CLIENT_SECRET
    const redirectUri = process.env.XERO_REDIRECT_URI
    const scopes = process.env.XERO_SCOPES?.split(' ') || []

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing Xero environment variables')
    }

    return new XeroClient({ clientId, clientSecret, redirectUris: [redirectUri], scopes })
}

export async function disconnectXero(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                xeroAccessToken: null,
                xeroRefreshToken: null,
                xeroTokenExpiry: null,
                xeroTenantId: null,
                xeroTenantName: null,
            }
        })
        return true
    } catch (error) {
        // Ignore "Record to update not found" error
        if ((error as any).code === 'P2025') {
            return false
        }
        throw error
    }
}
