import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
    return handleCorsOptions(request.headers.get('origin') || '')
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const abn = searchParams.get('abn')

        if (!abn) {
            return NextResponse.json({ error: 'ABN is required' }, { status: 400, headers: getCorsHeaders(request.headers.get('origin') || '') })
        }

        // Basic validation: ABN must be 11 digits
        const cleanAbn = abn.replace(/\D/g, '')
        if (cleanAbn.length !== 11) {
            return NextResponse.json({ valid: false, error: 'ABN must be 11 digits' }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
        }

        // ABN Checksum Validation
        // Weights: 10 1 3 5 7 9 11 13 15 17 19
        const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
        let sum = 0

        // Subtract 1 from the first digit
        const digits = cleanAbn.split('').map(Number)
        digits[0] -= 1

        for (let i = 0; i < 11; i++) {
            sum += digits[i] * weights[i]
        }

        const isValidChecksum = sum % 89 === 0

        if (!isValidChecksum) {
            return NextResponse.json({ valid: false, error: 'Invalid ABN checksum' }, { headers: getCorsHeaders(request.headers.get('origin') || '') })
        }

        // In a real scenario, we would call the ABR API here.
        // For now, we'll simulate a successful lookup if the checksum is valid.
        // We can return mock company data.

        const mockCompanyData = {
            entityName: 'MOCK COMPANY PTY LTD',
            gst: 'Active',
            status: 'Active'
        }

        return NextResponse.json({
            valid: true,
            ...mockCompanyData
        }, { headers: getCorsHeaders(request.headers.get('origin') || '') })

    } catch (error) {
        return NextResponse.json({ error: 'Validation failed' }, { status: 500, headers: getCorsHeaders(request.headers.get('origin') || '') })
    }
}
