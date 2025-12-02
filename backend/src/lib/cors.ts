// CORS utility for handling cross-origin requests

const ENV_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const ALLOWED_ORIGINS = ENV_ORIGINS.length
  ? ENV_ORIGINS
  : [
      'http://localhost:3646',
      'http://localhost:3645',
      'https://auditrail.trakit.biz',
    ]

export function getCorsHeaders(origin?: string | null): Record<string, string> {
  // Check if the origin is in our allowed list
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0] // Default to localhost for development

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}

export function createCorsResponse(data?: any, status: number = 200, origin?: string | null) {
  const headers = getCorsHeaders(origin)
  
  if (data) {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    })
  }
  
  return new Response(null, { status, headers })
}

export function handleCorsOptions(origin?: string | null) {
  const headers = getCorsHeaders(origin)
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      'Access-Control-Max-Age': '600',
      'Content-Length': '0'
    }
  })
}
