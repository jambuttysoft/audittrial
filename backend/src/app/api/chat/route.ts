import { NextRequest, NextResponse } from 'next/server'
import { getCorsHeaders, handleCorsOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  return handleCorsOptions(origin)
}

// Lightweight chat endpoint with optional OpenAI integration
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const corsHeaders = getCorsHeaders(origin)

  try {
    const body = await request.json()

    const messages = Array.isArray(body?.messages) ? body.messages : []
    const userId = body?.userId || null

    if (!messages.length || typeof messages[messages.length - 1]?.content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: messages array with a final user message is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const lastUserMessage = messages[messages.length - 1]?.content as string

    // Try OpenAI if configured, otherwise return a deterministic stub
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful assistant for the AuditTrail app.' },
              ...messages.map((m: any) => ({ role: m.role || 'user', content: String(m.content) })),
            ],
            temperature: 0.2,
          }),
        })

        if (!response.ok) {
          const text = await response.text()
          console.error('OpenAI error:', response.status, text)
          throw new Error(`OpenAI request failed: ${response.status}`)
        }

        const data = await response.json()
        const aiMessage = data?.choices?.[0]?.message?.content || 'Ok.'

        return NextResponse.json(
          { reply: aiMessage, userId, echo: lastUserMessage },
          { status: 200, headers: corsHeaders }
        )
      } catch (e: any) {
        console.warn('Falling back to stubbed reply due to OpenAI error:', e?.message)
        return NextResponse.json(
          { reply: `Echo: ${lastUserMessage}`, userId, note: 'OpenAI error, returned stubbed reply.' },
          { status: 200, headers: corsHeaders }
        )
      }
    }

    // Stubbed deterministic reply when OPENAI_API_KEY is not set
    return NextResponse.json(
      { reply: `Echo: ${lastUserMessage}`, userId, note: 'No OPENAI_API_KEY set.' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500, headers: corsHeaders }
    )
  }
}