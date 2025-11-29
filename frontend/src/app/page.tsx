'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Box } from 'lucide-react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name: string
  userType: 'INDIVIDUAL' | 'BUSINESS'
  phone?: string
  company?: string
  services?: string
  acceptsJobOffers: boolean
  acceptsTerms: boolean
}

interface LoginData {
  email: string
  password: string
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'INDIVIDUAL',
    phone: '',
    company: '',
    services: '',
    acceptsJobOffers: true,
    acceptsTerms: false
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Successful login! Redirecting...')
        localStorage.setItem('user', JSON.stringify(data.user))
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.message || 'Login error')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Login successful! Redirecting...')
        localStorage.setItem('user', JSON.stringify(data.user))
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.message || 'Google login failed')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 10) value = value.slice(0, 10)

    // Format as 04XX XXX XXX
    if (value.length >= 4) {
      value = value.slice(0, 4) + ' ' + value.slice(4)
    }
    if (value.length >= 8) {
      value = value.slice(0, 8) + ' ' + value.slice(8)
    }

    setRegisterData({ ...registerData, phone: value })
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setForgotPasswordEmail('')
        setTimeout(() => {
          setShowForgotPassword(false)
          setSuccess('')
        }, 3000)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!registerData.acceptsTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = registerData

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Please check your email to verify your account.')

        // Switch to login tab
        setActiveTab('login')

        // Scroll to top to show message
        window.scrollTo(0, 0)

        // Clear form
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          userType: 'INDIVIDUAL',
          phone: '',
          company: '',
          services: '',
          acceptsJobOffers: true,
          acceptsTerms: false
        })
      } else {
        setError(data.message || 'Registration error')
      }
    } catch (error) {
      setError('Server connection error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <div className="auth-container">
        <div className="auth-wrapper">
          {/* Left Panel: Info (Dark Side) */}
          <div className="auth-left">
            <div className="auth-content">
              {/* Header */}
              <div>
                <div className="brand-logo">
                  <Box size={32} /> TRAKYTT
                </div>
                <div style={{ marginTop: '40px' }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px', lineHeight: '1.2' }}>
                    TRAKYTT Validation Portal
                  </h1>
                  <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '12px', color: '#e4e4e7' }}>
                    The Compliance-First Platform for Source Document Automation
                  </p>
                  <p style={{ fontSize: '16px', color: '#a1a1aa', lineHeight: '1.6' }}>
                    Upload, validate, and prepare financial documents with automated GST logic,
                    ABN checks, and compliance-grade verification.
                  </p>
                </div>
              </div>

              {/* Mid Section - Features */}
              <div style={{ marginTop: '60px', marginBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#f4f4f5' }}>
                    Document Verification
                  </h3>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.5' }}>
                    Automated GST logic, ABN checks, vendor lookups & validation.
                  </p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#f4f4f5' }}>
                    Multi-Entity Management
                  </h3>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.5' }}>
                    Manage multiple clients & orgs.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#f4f4f5' }}>
                    Analytics & Reports
                  </h3>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.5' }}>
                    Audit-ready summaries & logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer-copyright" style={{ fontSize: '13px', color: '#71717a', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Early Access Version</strong> - Developed by 3030 Technologies © 2025
              </div>
              <div>
                For testing and evaluation only
              </div>
            </div>
          </div>

          {/* Right Panel: Forms (Light Side) */}
          <div className="auth-right">
            <div className="auth-header-mobile">
              <h1><Box size={24} /> TRAKYTT</h1>
            </div>

            {/* Login Form */}
            <div className={`auth-form auth-form-login ${activeTab === 'login' ? 'active' : ''}`} id="login-form">
              <div className="form-header">
                <h2>Welcome back</h2>
                <p>Enter your email to sign in to your account</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="m@example.com"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    type="password"
                    id="login-password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Sign In with Email'}
                </button>
              </form>

              <div className="auth-switch" style={{ marginTop: '16px', marginBottom: '16px' }}>
                <a onClick={() => { setShowForgotPassword(true); setError(''); }}>Forgot password?</a>
              </div>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                  useOneTap
                />
              </div>

              <div className="auth-switch">
                Don&apos;t have an account? <a onClick={() => { setActiveTab('register'); setError(''); }}>Sign up</a>
              </div>
            </div>

            {/* Register Form */}
            <div className={`auth-form ${activeTab === 'register' ? 'active' : ''}`} id="register-form">
              <div className="form-header">
                <h2>Create an account</h2>
                <p>Enter your email below to create your account</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <input
                      type="text"
                      id="register-name"
                      placeholder="John Doe"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                      type="email"
                      id="register-email"
                      placeholder="m@example.com"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input
                      type="password"
                      id="register-password"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-confirm">Confirm Password</label>
                    <input
                      type="password"
                      id="register-confirm"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-type">Account Type</label>
                    <select
                      id="register-type"
                      value={registerData.userType}
                      onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value as 'INDIVIDUAL' | 'BUSINESS' })}
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-phone">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="register-phone"
                      placeholder="04XX XXX XXX"
                      value={registerData.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>

                  {registerData.userType === 'BUSINESS' && (
                    <div className="form-group full-width">
                      <label htmlFor="register-company">Company Name</label>
                      <input
                        type="text"
                        id="register-company"
                        placeholder="Company Name"
                        value={registerData.company}
                        onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="register-terms"
                      checked={registerData.acceptsTerms}
                      onChange={(e) => setRegisterData({ ...registerData, acceptsTerms: e.target.checked })}
                    />
                    I agree to the <a href="#" style={{ textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="register-offers"
                      checked={registerData.acceptsJobOffers}
                      onChange={(e) => setRegisterData({ ...registerData, acceptsJobOffers: e.target.checked })}
                    />
                    Accept job offers from clients
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                />
              </div>

              <div className="auth-switch">
                Already have an account? <a onClick={() => { setActiveTab('login'); setError(''); }}>Sign in</a>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%',
                position: 'relative'
              }}>
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                    setSuccess('')
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#71717a'
                  }}
                >
                  ×
                </button>

                <div className="form-header">
                  <h2>Reset Password</h2>
                  <p>Enter your email to receive a password reset link</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email</label>
                    <input
                      type="email"
                      id="forgot-email"
                      placeholder="m@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider >
  )
}
