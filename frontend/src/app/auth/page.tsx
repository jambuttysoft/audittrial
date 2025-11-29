"use client"

import { useState } from 'react'
import { Box } from 'lucide-react'

export default function Page() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userType, setUserType] = useState('user')
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [errorRequestId, setErrorRequestId] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [errorRaw, setErrorRaw] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setErrorStatus(null)
    setErrorRequestId('')
    setErrorCode('')
    setErrorRaw('')
    if (!email || !password || !name) { setError('Please fill in all fields'); return }
    setIsLoading(true)
  try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, userType })
      })
      const raw = await resp.text()
      let data: any = undefined
      try { data = JSON.parse(raw) } catch { data = raw }
      if (!resp.ok) {
        let msg = ''
        let code = ''
        let reqId = ''
        const firstDetail = (Array.isArray((data as any)?.error?.details) && (data as any).error.details[0]) || null
        const detailMessage = firstDetail?.message || ''

        if (typeof data === 'string') {
          msg = data
        } else if (data && typeof data === 'object') {
          // Prefer specific details over generic messages, especially for 409
          msg = (
            detailMessage ||
            (data as any)?.error?.message ||
            (typeof (data as any)?.error === 'string' ? (data as any).error : '') ||
            (data as any)?.message ||
            ''
          )
          code = (data as any)?.code || (data as any)?.error?.code || ''
          reqId = (data as any)?.requestId || (data as any)?.request_id || ''
        }
        if (!msg) msg = `Registration failed (${resp.status})`
        setError(msg)
        setErrorStatus(resp.status)
        setErrorRequestId(reqId)
        setErrorCode(code)
        setErrorRaw(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
      } else {
        setSuccess('Registration successful. Check your email to verify your account.')
        setName('')
        setEmail('')
        setPassword('')
      }
    } catch {
      setError('Network error. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '420px', width: '100%', padding: '40px' }}>
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>
            <Box size={32} /> TRAKYTT
          </div>
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Register to start using the app</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm"><span className="font-semibold">Registration error:</span> {error}</p>
              <div className="text-red-600 text-xs mt-1">
                {errorStatus !== null && <span>Status: {errorStatus}</span>}
                {errorCode && <span style={{ marginLeft: '8px' }}>Code: {errorCode}</span>}
                {errorRequestId && <span style={{ marginLeft: '8px' }}>RequestId: {errorRequestId}</span>}
              </div>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          {errorRaw && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm"><span className="font-semibold">Server error body:</span></p>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} className="text-red-700 text-xs mt-1">{errorRaw}</pre>
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label htmlFor="user-type">User Type</label>
              <select id="user-type" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
