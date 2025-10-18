// CORS utility for handling cross-origin requests

const ALLOWED_ORIGINS = [
  'http://localhost:3112',
  'http://localhost:3111',
  'https://auditrail.trakit.biz'
]

export function getCorsHeaders(origin?: string | null): Record<string, string> {
  // Check if the origin is in our allowed list
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0] // Default to localhost for development

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
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
  return createCorsResponse(null, 200, origin)
}