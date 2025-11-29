import { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}><div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>TRAKYTT</div><div><h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#09090b' }}>Verifying your email...</h2><p style={{ color: '#71717a' }}>Loading...</p></div></div></div></div>}>
      <VerifyClient />
    </Suspense>
  )
}
