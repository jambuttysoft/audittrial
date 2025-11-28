'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box } from 'lucide-react'

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('No verification token provided')
            return
        }

        // Verify email
        fetch(`http://localhost:3645/api/auth/verify?token=${token}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.verified || data.message.includes('already verified')) {
                    setStatus('success')
                    setMessage(data.message)

                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        router.push('/auth')
                    }, 3000)
                } else {
                    setStatus('error')
                    setMessage(data.error || 'Verification failed')
                }
            })
            .catch(error => {
                console.error('Verification error:', error)
                setStatus('error')
                setMessage('An error occurred during verification')
            })
    }, [searchParams, router])

    return (
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
                            <p style={{ color: '#71717a', marginBottom: '30px' }}>{message}</p>
                            <button
                                onClick={() => router.push('/auth')}
                                className="btn btn-primary"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
