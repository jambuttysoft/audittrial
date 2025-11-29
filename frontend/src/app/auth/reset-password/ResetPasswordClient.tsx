'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box } from 'lucide-react'

export default function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    const token = searchParams.get('token')
    if (!token) { setError('Invalid reset link'); return }
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3645/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ token, password })
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess(true)
        setTimeout(() => { router.push('/auth') }, 3000)
      } else { setError(data.error || 'Password reset failed') }
    } catch { setError('An error occurred. Please try again.') } finally { setIsLoading(false) }
  }

  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ maxWidth: '400px', width: '100%', padding: '40px' }}><div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}><Box size={32} /> TRAKYTT</div><div className="form-header"><h2>Reset Your Password</h2><p>Loading...</p></div></div></div></div>}>
      {success ? (
        <div className="auth-container">
          <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
              <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>
                <Box size={32} /> TRAKYTT
              </div>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Password Reset Successful!</h2>
              <p style={{ color: '#71717a', marginBottom: '20px' }}>Your password has been reset successfully.</p>
              <p style={{ color: '#71717a', fontSize: '14px' }}>Redirecting to login...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-container">
          <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
              <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>
                <Box size={32} /> TRAKYTT
              </div>
              <div className="form-header">
                <h2>Reset Your Password</h2>
                <p>Enter your new password below</p>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>{isLoading ? 'Resetting Password...' : 'Reset Password'}</button>
              </form>
              <div className="auth-switch">
                Remember your password? <a onClick={() => router.push('/auth')}>Sign in</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  )
}
