'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box } from 'lucide-react'

export default function VerifyClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendError, setResendError] = useState('')
  const [resendSuccess, setResendSuccess] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('No verification token provided'); return }
    fetch(`/api/auth/verify?token=${token}`, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.verified || (data.message || '').includes('already verified')) {
          setStatus('success'); setMessage(data.message)
          setTimeout(() => { router.push('/') }, 3000)
        } else { setStatus('error'); setMessage('Activation link has expired') }
      })
      .catch(() => { setStatus('error'); setMessage('An error occurred during verification') })
  }, [searchParams, router])

  useEffect(() => { setResendDisabled(false) }, [email])

  const handleResend = async () => {
    if (!email || isResending || resendDisabled) return
    setResendError('')
    setResendSuccess('')
    setMessage('')
    setIsResending(true)
    try {
      const resp = await fetch('/api/auth/resend-verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email })
      })
      const raw = await resp.text()
      let data: any
      try { data = JSON.parse(raw) } catch { data = raw }
      if (resp.ok) {
        setResendSuccess('Activation sent. Please check your email and click the link')
        setResendDisabled(true)
        setTimeout(() => setResendDisabled(false), 60000)
      } else if (resp.status === 429) {
        setResendError('Too many requests. Please try again later')
      }
      console.error('Verify resend', { status: resp.status, data })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}><div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}><Box size={32} /> TRAKYTT</div><div><h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Verifying your email...</h2><p style={{ color: '#71717a' }}>Loading...</p></div></div></div></div>}>
      <div className="auth-container">
        <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
            <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>
              <Box size={32} /> TRAKYTT
            </div>
            {status === 'loading' && (
              <div>
                <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Verifying your email...</h2>
                <p style={{ color: '#71717a' }}>Please wait while we verify your email address.</p>
              </div>
            )}
            {status === 'success' && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
                <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Email Verified!</h2>
                <p style={{ color: '#71717a', marginBottom: '20px' }}>{message}</p>
                <p style={{ color: '#71717a', fontSize: '14px' }}>Redirecting to login...</p>
              </div>
            )}
            {status === 'error' && (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>✗</div>
                <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Verification Failed</h2>
                <p style={{ color: '#71717a', marginBottom: '20px' }}>{message}</p>
                <div style={{ marginBottom: '16px' }}>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" className="input" />
                </div>
                {resendError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">{resendError}</p></div>
                )}
                {resendSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"><p className="text-green-600 text-sm">{resendSuccess}</p></div>
                )}
                <button
                  onClick={handleResend}
                  disabled={!email || resendDisabled || isResending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#09090b', color: 'white', padding: '8px 16px', borderRadius: '6px' }}
                >
                  {isResending ? 'Sending...' : 'Resend Activation'}
                </button>
                <div style={{ marginTop: '16px' }}>
                  <button onClick={() => router.push('/')} className="btn btn-secondary">Go to Login</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  )
}
